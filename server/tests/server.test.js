const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

         request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(201)
            .expect((res) => expect(res.body.text).toBe(text))
            .end((err, res) => {
                if(err) return done(err);                
                Todo.findByIdAndRemove(res.body._id)
                    .then((todo) => {
                        expect(todo.text).toBe(text);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should not create todo with empty value of "text" field', (done) => {
        var text = ' ';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(400)
            .end((err, res) => {
                if(err) return done(err);                
                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length).toBe(0);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {
    it('should return todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should get status 404 if id of todo not valid', (done) => {
        request(app)
            .get(`/todos/123abc`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should get status 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo by id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toString());
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(res.body._id)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should not delete todo by id created by another user', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(todos[0]._id.toString())
                    .then((todo) => {
                        expect(todo).toExist();
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectId().toString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo id is not nvalid', (done) => {
        request(app)
            .delete(`/todos/123abc`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id;
        var text = 'Changed text';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({ text, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBeTruthy();
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(res.body.todo._id)
                    .then((todo) => {
                        expect(todo.text).toBe(text);
                        expect(todo.completed).toBeTruthy();
                        expect(todo.completedAt).toBeA('number');
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should not update the todo created by another user', (done) => {
        var id = todos[0]._id;
        var text = 'Changed text';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ text, completed: true })
            .expect(404)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(id)
                    .then((todo) => {
                        expect(todo.text).toBe(todos[0].text);
                        expect(todo.completed).toBeFalsy();
                        expect(todo.completedAt).toBe(null);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id;
        var text = 'Changed text';
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({ text, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end((err, res) => {
                if(err) return done(err);
                Todo.findById(res.body.todo._id)
                    .then((todo) => {
                        expect(todo.text).toBe(text);
                        expect(todo.completed).toBeFalsy();
                        expect(todo.completedAt).toNotExist();
                        done();
                    })
                    .catch((e) => done(e));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toString());
                expect(res.body.email).toBe(users[0].email);
                expect(Object.keys(res.body).length).toBe(2);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });

    it('should return 401 if token not found', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', '123')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create new user', (done) => {
        var email = 'test@email.com';
        var password = '123abc!';
        var token;
        
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                token = jwt.sign({ _id: res.body._id, access: 'auth' }, process.env.JWT_SECRET).toString();
                expect(res.headers['x-auth']).toBe(token);
                expect(res.body.email).toBe(email);
                expect(res.body._id).toExist();
                expect(Object.keys(res.body).length).toBe(2);
            })
            .end((err, res) => {
                if(err) return done(err);     
                User.findByIdAndRemove(res.body._id).then((doc) => {
                    expect(doc.email).toBe(res.body.email);
                    expect(doc.password).toNotBe(password);
                    expect(doc.tokens[0].access).toBe('auth');
                    expect(doc.tokens[0].token).toBe(token);
                    done();
                })
                .catch((e) => {
                    done(e);
                });
            });
    });

    it('shoud return validation error if email invalid', (done) => {
        var email = 'testemail.com';
        var password = '123abc!';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                    if(err) return done(err);
                    User.find({}).then((users) => {
                        expect(users.length).toBe(2);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            });
    });

    it('shoud return validation error if password invalid', (done) => {
        var email = 'test@email.com';
        var password = '123';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                    if(err) return done(err);
                    User.find({}).then((users) => {
                        expect(users.length).toBe(2);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            });
    });

    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({email: users[0].email, password: users[0].password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                    if(err) return done(err);
                    User.find({}).then((users) => {
                        expect(users.length).toBe(2);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            });
    });
});

describe('POST /users/login', () => {
    it('login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[1].email);
                expect(res.body._id).toExist();
                expect(res.headers['x-auth']).toExist();
            }).end((err, res) => {
                if(err) return done(err);
                User.findById(res.body._id).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return 400 if password wrong', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password + '123' })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
                expect(res.headers['x-auth']).toNotExist();
            }).end((err, res) => {
                if(err) return done(err);
                User.findById(users[1]._id).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return 400 if email not found', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[0].email + '123', password: users[0].password })
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
                expect(res.headers['x-auth']).toNotExist();
            }).end((err, res) => {
                if(err) return done(err);
                User.find({ email: users[0].email + '123'}).then((users) => {
                    expect(users[0]).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should delete token if user log out', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body).toEqual({});
                expect(res.headers['x-auth']).toNotExist();
            }).end((err, res) => {
                if(err) return done();
                User.findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
            });
    });

    it('should return 401 if user not authenticated', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token + '123')
            .expect(401)
            .end((err, res) => {
                if(err) return done();
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});
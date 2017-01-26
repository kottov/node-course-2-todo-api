const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongoose').Types;

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    {
        _id: new ObjectId(),
        text: 'Test todo 1'
    },
    {
        _id: new ObjectId(),
        text: 'Test todo 2',
        completed: true,
        completedAt: 333
    }
];


beforeEach((done) => {
    Todo.remove()
        .then(() => Todo.insertMany(todos))
        .then(() => done())
        .catch((e) => done(e));
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

         request(app)
            .post('/todos')
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {
    it('should return todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should get status 404 if id of todo not valid', (done) => {
        request(app)
            .get(`/todos/123abc`)
            .expect(404)
            .end(done);
    });

    it('should get status 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toString()}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo by id', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toString());
            })
            .end((err, res) => {
                if(err) done(err);
                Todo.findById(res.body._id)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectId().toString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo id is not nvalid', (done) => {
        request(app)
            .delete(`/todos/123abc`)
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
            .send({ text, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBeTruthy();
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if(err) done(err);
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

    it('should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id;
        var text = 'Changed text';
        request(app)
            .patch(`/todos/${id}`)
            .send({ text, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end((err, res) => {
                if(err) done(err);
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
const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongoose').Types;

const { app } = require('../server');
const { Todo } = require('../models/todo');

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
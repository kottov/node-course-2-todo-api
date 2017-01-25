const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send({ todos });
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

app.get('/todos/:id', (req, res) => {
    Todo.findById(req.params.id)
        .then((todo) => {
            if(!todo) res.send('Todo not found');
            res.send(todo);
        })
        .catch((e) => res.send(e));
});

app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text }).save()
        .then((doc) => {
            res.status(201).send(doc);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

app.listen(3000, () => console.log('Web server started on port 3000'));

module.exports = { app };
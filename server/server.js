const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongoose').Types;

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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
    var id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(req.params.id)
        .then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }
            res.send({ todo });
        })
        .catch((e) => res.status(400).send(e));
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

app.listen(port, () => console.log(`Web server started on port ${port}`));

module.exports = { app };
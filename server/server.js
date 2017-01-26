require('./config/config');

const _ = require('lodash');
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

app.delete('/todos/:id', (req, res) => {
    if(!ObjectId.isValid(req.params.id)) res.status(404).send();
    Todo.findByIdAndRemove(req.params.id)
        .then((todo) => {
            if(!todo) res.status(404).send();
            res.send({todo});
        })
        .catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(req.params.id)) res.status(404).send();
    
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if(!todo) res.status(404).send();
            res.send({todo});
        })
        .catch((e) => res.status(400).send(e));
});

app.listen(port, () => console.log(`Web server started on port ${port}`));

module.exports = { app };
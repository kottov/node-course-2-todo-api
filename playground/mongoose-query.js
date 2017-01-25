const { ObjectId } = require('mongoose').Types;

const mongoose = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// var _id = '5888dae202e4f3a726df08881';

// console.log(ObjectId.isValid(_id));


// Todo.find({ _id })
//     .then((todos) => console.log('Todos by id:', todos))
//     .catch((e) => console.log(e));

// Todo.findOne({ _id })
//     .then((doc) => console.log('Todo by id:', doc))
//     .catch((e) => console.log(e));

// Todo.findById(_id)
//     .then((doc) => {
//         if(!doc) return console.log('Item not found');
//         console.log('Todo by id:', doc);
//     })
//     .catch((e) => console.log(e.message));


User.findById('5888ea426b78af4c15650cab')
    .then(user => {
        if(!user) return console.log('User not found');
        console.log(user);
    })
    .catch((e) => console.log(e.message));


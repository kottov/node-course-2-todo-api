const { ObjectId } = require('mongoose').Types;

const mongoose = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// Todo.remove({})
//     .then((result) => console.log(result));

Todo.findByIdAndRemove('588a15e76b78af4c15652454')
    .then((todo) => console.log(todo));

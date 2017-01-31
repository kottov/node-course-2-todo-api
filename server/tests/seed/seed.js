const { ObjectId } = require('mongoose').Types;
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
    _id: userOneId,
    email: 'userone@test.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'usertwo@test.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
    }]
}];

const todos = [
    {
        _id: new ObjectId(),
        text: 'Test todo 1',
        _creator: userOneId
    },
    {
        _id: new ObjectId(),
        text: 'Test todo 2',
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
    Todo.remove()
        .then(() => Todo.insertMany(todos))
        .then(() => done())
        .catch((e) => done(e));
};

const populateUsers = (done) => {
    User.remove().then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
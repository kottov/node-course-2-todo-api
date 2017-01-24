const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate(
    //     { _id: new ObjectID('5887b4246b78af4c1564b45e') },
    //     { $set: { completed: true } },
    //     { returnOriginal: false })
    //         .then((result) => { console.log(result); })
    //         .catch((err) => { console.log(`Unable to update: ${err}`); });

    db.collection('Users').findOneAndUpdate(
        { _id: new ObjectID('5886819da4112420c2e44477') },
        { $set: { name: 'Jane' } },
        { returnOriginal: false })
            .then((result) => console.log(result))
            .catch((err) => console.log(err));
    
    // db.collection('Users').findOneAndUpdate({ name: 'John' },
    // { $inc: { age: 1 } },
    // { returnOriginal: false })
    //     .then((result) => console.log(result))
    //     .catch((err) => console.log(`Unable to update: ${err}`));


    // db.close();
});
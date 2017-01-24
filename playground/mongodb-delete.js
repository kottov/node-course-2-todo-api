const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').deleteMany({ text: 'Eat lunch' })
    //     .then((result) => {
    //         console.log(result);
    //     })
    //     .catch((err) => {
    //         console.log(err); 
    //     });

    // db.collection('Todos').deleteOne({ text: 'Eat lunch' })
    //     .then((result) => {
    //         console.log(result);
    //     });

    // db.collection('Todos').findOneAndDelete({ completed: false })
    //     .then((result) => {
    //         console.log(result);
    //     });

    db.collection('Users').deleteMany({ name: 'Jim' })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(`Unable to delete: ${err}`);
        });
    
    db.collection('Users').findOneAndDelete({ _id: new ObjectID('5887a3e25d33ca37f89c7ac7') })
        .then((result) => {
            console.log(JSON.stringify(result, null, 2));
        })
        .catch((err) => {
            console.log(`Unable to delete: ${err}`);
        });

    // db.close();
});
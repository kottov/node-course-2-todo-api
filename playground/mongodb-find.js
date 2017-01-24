const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').find({ _id: new ObjectID('58867f927125691fbc964e9e') }).toArray()
    //     .then((docs) => { console.log(JSON.stringify(docs, null, 2)); })
    //     .catch((err) => { console.log('Unable to fetch data:', err); });

    // db.collection('Todos').find().count()
    //     .then((count) => { console.log(`Todos count: ${count}`) })
    //     .catch((err) => { console.log('Unable to fetch data:', err); });

    db.collection('Users').find({ name: 'Jane' }).toArray()
        .then((docs) => {
            console.log(JSON.stringify(docs, null, 2));
        })
        .catch((err) => {
            console.log(`Unable to execute request to DB: ${err}`);
        });

    // db.close();
});
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);


var decoded = jwt.verify(token, '123abc');
console.log(decoded);

data.id = 8;
var changedToken = jwt.sign(data, 'abc123');

try {
    var changedDecoded = jwt.verify(changedToken, '123abc');
    console.log(changedDecoded);
} catch(e) {
    console.log('Data was changed.', e.message);
    
}




// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(hash);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };

// token.hash = SHA256(JSON.stringify(token.data)).toString();
// token.data.id = 5;

// var resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed.');
// } else {
//     console.log('Data was changed, Do not trust.');
// }
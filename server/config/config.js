const env = process.env.NODE_ENV || 'dev';

if(env === 'test') {
    process.env.PORT = 3001;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if(env === 'dev') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
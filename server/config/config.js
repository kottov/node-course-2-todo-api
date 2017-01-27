const env = process.env.NODE_ENV || 'dev';

if(env === 'test') {
    process.env.PORT = 3001;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    process.env.SALT_DEEP = 1;
} else if(env === 'dev') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    process.env.SALT_DEEP = 1;
} else if(env === 'production') {
    process.env.SALT_DEEP = 10;
}
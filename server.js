const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

//Creating Hosted MongoDB path in order to specify during connection.
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Connecting Node Application with MongoDB Database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DATABASE CONNECTED');
  });

const server = process.env.PORT;

const appServer = app.listen(server, '127.0.0.1', () => {
  console.log(`Server is running at port ${server}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  appServer.close(() => {
    process.exit(1); // 0 - > success , 1 -> Uncaught Exception
  });
});

process.on('uncaughtException',(err)=>{
  appServer.close(() => {
    process.exit(1); // 0 - > success , 1 -> Uncaught Exception
  });
})

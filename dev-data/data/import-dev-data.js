const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './../../config.env' });

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('All Data has been inserted successfully');
    process.exit();
  } catch (err) {
    console.log(`We had encountered error:${err}`);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('All Data has been deleted successfully');
    process.exit();
  } catch (err) {
    console.log(`We had encountered error:${err}`);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

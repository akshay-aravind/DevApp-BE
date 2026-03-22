const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://sky:%23123password@devtinder.t4f7mw8.mongodb.net/devTinder');
};


module.exports = connectDB

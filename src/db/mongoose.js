const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/raina-db2'; //db name

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

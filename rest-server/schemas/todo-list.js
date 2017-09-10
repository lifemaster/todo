const mongoose = require('../helpers/mongoDB');
const Schema = mongoose.Schema;

let todoListSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  order: Number
});

module.exports = mongoose.model('TodoList', todoListSchema);
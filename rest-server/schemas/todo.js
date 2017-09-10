const mongoose = require('../helpers/mongoDB');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  listId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  isDone: {
    type: Boolean,
    default: false
  },
  order: Number
});

module.exports = mongoose.model('Todo', todoSchema);
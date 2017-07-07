const mongoose = require('../helpers/mongoDB');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  groupId: {
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
  }
});

module.exports = mongoose.model('Todo', todoSchema);
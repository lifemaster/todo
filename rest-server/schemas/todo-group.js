const mongoose = require('../helpers/mongoDB');
const Schema = mongoose.Schema;

let todoGroupSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String
});

module.exports = mongoose.model('TodoGroup', todoGroupSchema);
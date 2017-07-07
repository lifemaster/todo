const crypto = require('crypto');
const mongoose = require('../helpers/mongoDB');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    default: Date.now()
  }
});

userSchema.methods.encryptPassword = function(password) {
  return crypto.Hmac('sha1', this.salt).update(password).digest('hex');
}

userSchema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this.password;
  });

userSchema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
}

module.exports = mongoose.model('User', userSchema);
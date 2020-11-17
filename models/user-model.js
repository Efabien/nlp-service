const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, required: true },
  hash: { type: String, required: true }
}, {
  timestamps: true
});
const User = mongoose.model('user', schema);

module.exports = User;
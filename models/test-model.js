const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = new Schema({
  cases: [
    {
      input: { type: String, required: true },
      expected: { type: String, required: true }
    }
  ],
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});
const Test = mongoose.model('test', schema);

module.exports = Test;

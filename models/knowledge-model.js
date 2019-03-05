const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = new Schema({
  theme: { type: String, required: true },
  keyWords: { type: Object, required: true },
  intents: { type: Object, required: true },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});
const Knowledge = mongoose.model('knowledge', schema);

module.exports = Knowledge;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = new Schema({
  theme: { type: String, required: true },
  keyWords: { type: Object, default: {} },
  intents: { type: Object, required: true },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true,
  minimize: false
});
const Knowledge = mongoose.model('knowledge', schema);

module.exports = Knowledge;

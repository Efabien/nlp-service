const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'app',
    required: true
  },
  knowledge: { type: ObjectId, ref: 'knowledge', required: true },
  intents: { type: [{ type: String, required: true }], required: true }
}, {
  timestamps: true
});
const Subscrition = mongoose.model('subscription', schema);

module.exports = Subscrition;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.SchemaTypes.ObjectId;

const schema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true
  },
  name: { type: String, required: true }
}, {
  timestamps: true
});
const App = mongoose.model('app', schema);

module.exports = App;

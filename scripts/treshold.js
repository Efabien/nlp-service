const mongoose = require('mongoose');
const { APP } = require('../config');
const connectionString = APP.connectionString;
console.log(connectionString)


mongoose.connect(connectionString, { useNewUrlParser: true });
const knModel = require('../models/knowledge-model');

const run = async () => {
  const knls = await knModel.find({});
  const count = knls.length;
  for (let i = 0; i < count; i++) {
    let current = knls[i];
    let intents = Object.keys(current.intents).reduce((result, key) => {
      let copy = current.intents[key];
      copy.treshold = 0;
      result[key] = copy;
      return result;
    }, {});
    await knModel.update(
      {
        _id: current._id
      },
      {
        $set: { 'intents': intents }
      }
    );
    console.log(`${i + 1} / ${count} done`);
  }
};

run();
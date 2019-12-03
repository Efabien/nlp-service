const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class UpdateTest {
  constructor(models, modules) {
    this._testModel = models.testModel;
    this._knwModel = models.knowledgeModel;
    this._cognitive = modules.cognitive;
    this.handler = this.handler.bind(this);
    this._schema = Joi.compile({
      cases: Joi.array().items(Joi.object({
        input: Joi.string().required(),
        expected: Joi.string().required()
      })).required()
    });
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      const test = await this._save(data, req.user);
      await this._adjustTresholds(data, req.user)
      return res.status(httpStatus.OK).json({ test });
    } catch (e) {
      return next(e);
    }
  }

  _save(data, userId) {
    return this._testModel.findOneAndUpdate(
      { owner: userId },
      data,
      { new: true, upsert: true }
    );
  }

  async _adjustTresholds(data, userId) {
    let recordable = data.cases.reduce((groupe, current) => {
      let hasGroupe = false;
      for (let i = 0; i < groupe.length; i++) {
        if (groupe[i][0].expected === current.expected) {
          groupe[i].push(current);
          hasGroupe = true;
          break;
        }
      }
      if (!hasGroupe) groupe.push([current]);
      return groupe;
    }, []).filter(groupe => groupe.length >= 10);
    recordable = recordable.map(record => {
      return record.reduce((result, testCase) => {
        result.inputs.push(testCase.input);
        return result;
      }, { intent: record[0].expected, inputs: [] });
    });
    for (let i = 0; i < recordable.length; i ++) {
      recordable[i].treshold = await this._getMinScore(recordable[i].inputs, userId);
    }
    
    for (let j = 0; j < recordable.length; j ++) {
      let record = recordable[j];
      let filter = {
        owner: userId,
        [`intents.${record.intent}`]: { $exists: true }
      };
      let $set = {
        [`intents.${record.intent}.treshold`] : record.treshold
      }
      await this._knwModel.update(filter, $set);
    }
  }


  async _getMinScore(inputs, userId) {
    let minScore = 10;
    for (let i = 0; i < inputs.length; i++) {
      let { intent } = await this._cognitive.infer(userId, inputs[i]);
      if (intent.score < minScore) minScore = intent.score;
    }
    return minScore;
  }

  _validate(data) {
    const result = Joi.validate(data, this._schema);
    if (result.error) {
      const err = new Error(result.error.details[0].message);
      err.statusCode = httpStatus.BAD_REQUEST;
      throw err;
    }
    return result.value;
  }
}
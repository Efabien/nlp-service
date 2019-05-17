const httpStatus = require('http-status');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class UpdateKnowledge {
  constructor(models, modules) {
    this.handler = this.handler.bind(this);
    this._knowledgeModel = models.knowledgeModel;
    this._resourceValidator = modules.resourceValidator;
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.params.id, req.body);
      const updateQuery = this._buildQuery(data);
      const knowledge = await this._knowledgeModel.findOneAndUpdate(
        { _id: req.params.id },
        updateQuery,
        { new: true }
      ).lean();
      if (!knowledge) throw new Error(`knowledge with id ${req.params.id} not found`);
      return res.status(httpStatus.OK).json({ knowledge });
    } catch (e) {
      return next(e);
    }
  }

  _validate(id, body) {
    let valideKeywords = true;
    let valideIntents = true;
    let error = new Error();
    error.status = httpStatus.BAD_REQUEST;
    if (!ObjectId.isValid(id)) {
      error.message = 'Bad id'
      throw error;
    }
    if (body.keyWords) {
      valideKeywords = this._resourceValidator.valdiateKeywords(body.keyWords);
    }
    if (body.intents) {
      valideIntents = this._resourceValidator.validateIntents(body.intents);
    }
    if (!valideKeywords) {
      error.message = 'keyWords structures are wrong';
      throw error;
    }
    if (!valideIntents) {
      error.message = 'Intents structures are wrong';
      throw error;
    }
    return body;
  }

  _buildQuery(data) {
    const query = {
      $set: {}
    };
    if (data.keyWords) {
      const keyWordsKeys = Object.keys(data.keyWords);
      const keyWordsToSave = keyWordsKeys.reduce((resulte, key) => {
        resulte[`keyWords.${key}`] = data.keyWords[key];
        return resulte;
      }, {});
      query.$set = _.merge(query.$set, keyWordsToSave);
    }

    if (data.intents) {
      const intentsKeys = Object.keys(data.intents);
      const intentsToSave = intentsKeys.reduce((resulte, key) => {
        resulte[`intents.${key}`] = data.intents[key];
        return resulte;
      }, {});
      query.$set = _.merge(query.$set, intentsToSave);
    }
    return query;
  }
}

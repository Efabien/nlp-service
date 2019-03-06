const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class Detection {
  constructor(models, modules) {
    this.handler = this.handler.bind(this);

    this._brain = modules.brain;
    this._knowledgeModel = models.knowledgeModel;

    this._schema = Joi.compile({
      text: Joi.string().required()
    });
  }

  async handler(req, res, next) {
    try {
      const text = this._validate(req.body).text;
      const knowledges = await this._knowledgeModel.find(
        { owner: req.user },
        { keyWords: 1, intents: 1 }
      ).lean();
      const { analyse, keyWords } = this._brain.detect(text, knowledges);
      return res.status(httpStatus.OK).json({ analyse, keyWords });
    } catch (e) {
      return next(e);
    }
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
const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class Detection {
  constructor(models, modules) {
    this.handler = this.handler.bind(this);

    this._brain = modules.brain;
    this._knowledgeModel = models.knowledgeModel;
    this._cognitive = modules.cognitive;

    this._schema = Joi.compile({
      text: Joi.string().required()
    });
  }

  async handler(req, res, next) {
    try {
      const text = this._validate(req.body).text;
      if (!req.query.single) return this._rawResponse(req.user, text, res);
      return this._response(req.user, text, res);
    } catch (e) {
      return next(e);
    }
  }

  async _rawResponse(userId, text, res) {
    const { analyse, keyWords } = await this._cognitive.detect(userId, text);
    return res.status(httpStatus.OK).json({ analyse, keyWords });
  }

  async _response(userId, text, res) {
    const { intent, keyWords } = await this._cognitive.infer(userId, text);
    return res.status(httpStatus.OK).json({ intent, keyWords });
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
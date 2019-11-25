const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class Test {
  constructor(modules) {
    this._cognitive = modules.cognitive;
    this.handler = this.handler.bind(this);
    this._schema = Joi.compile({
      cases: Joi.array().items(Joi.object({
        input: Joi.string().required(),
        expected: Joi.string().required()
      }).required()).required()
    });
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      const { successRate, wrongs } = await this._test(req.user, data.cases);
      res.status(httpStatus.OK).json({ successRate, wrongs })
    } catch (e) {
      return next(e);
    }
  }

  async _test(userId, cases) {
    let correctCount = 0;
    const wrongs = [];
    const total = cases.length;
    for (let i = 0; i < total; i++) {
      let current = cases[i];
      let { intent } = await this._cognitive.infer(userId, current.input);
      if (intent.intent === current.expected) {
        correctCount ++;
      } else {
        wrongs.push(
          { 
            ...current,
            detected: intent
          }
        );
      }
    }
    return {
      successRate: correctCount / total,
      wrongs
    };
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
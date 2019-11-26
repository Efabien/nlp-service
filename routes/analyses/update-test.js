const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class UpdateTest {
  constructor(models) {
    this._testModel = models.testModel;
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
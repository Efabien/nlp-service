const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class CreateApp {
  constructor(models) {
    this._appModel = models.appModel;
    this.handler = this.handler.bind(this);

    this._schema = Joi.compile({
      name: Joi.string().required()
    });
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      const app = await this._record(req.user, data);
      return res.status(httpStatus.CREATED).json({ app });
    } catch (e) {
      return next(e);
    }
  }

  async _record(userId, data) {
    const result = await this._appModel.create({
      owner: userId,
      ...data
    });
    return result._doc;
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
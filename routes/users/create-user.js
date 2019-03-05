const httpStatus = require('http-status');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

module.exports = class CreateUser {
  constructor(models, config) {
    this.handler = this.handler.bind(this);

    this._userModel = models.userModel;
    this._saltRounds = config.saltRounds;

    this._schema = Joi.compile({
      email: Joi.string().required(),
      password: Joi.string().required()
    });
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      await this._checkUser(data.email);
      const user = await this._userModel.create({
        email: data.email,
        hash: await bcrypt.hash(data.password, this._saltRounds)
      });
      return res.status(httpStatus.CREATED).json({
        user: _.pick(user, ['_id', 'email'])
      });
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

  async _checkUser(email) {
    const count = await this._userModel.countDocuments(
      { email }
    );
    if (!count) return;
    const err = new Error('User already exists');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }
}
const httpStatus = require('http-status');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = class AuthenticateUser {
  constructor(models, modules) {
    this.handler = this.handler.bind(this);

    this._userModel = models.userModel;
    this._sessionManager = modules.sessionManager;

    this._schema = Joi.compile({
      email: Joi.string().required(),
      password: Joi.string().required()
    });
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      const { token, user } = await this._checkUser(data);
      return res.status(httpStatus.OK).json({ ok: true, token, user });
    } catch (e) {
      return next(e);
    }
  }

  async _checkUser(data) {
    const user = await this._userModel.findOne(
      { email: data.email },
      { hash: 1, email: 1 }
    ).lean();
    if (!user || !(await bcrypt.compare(data.password, user.hash))) {
      const err = new Error('Wrong email or Wrong password');
      err.statusCode = httpStatus.UNAUTHORIZED;
      throw err;
    }

    const token = this._generateToken(user);

    return {
      token,
      user: _.pick(user, ['_id', 'email'])
    };
  }

  _generateToken(user) {
    return this._sessionManager.signIn({
      email: user.email,
      userId: user._id
    });
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
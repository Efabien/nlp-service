const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class GenerateToken {
  constructor(models, modules) {
    this._appModel = models.appModel;
    this._sessionManager = modules.sessionManager;
    this.handler = this.handler.bind(this);
  }

  async handler(req, res, next) {
    try {
      const app = await this._check(req.user, req.params.id);
      const token = this._generate(app);
      return res.status(httpStatus.OK).json({ app, token });
    } catch (e) {
      return next(e);
    }
  }

  _generate(app) {
    return this._sessionManager.signInApp(
      {
        appId: app._id,
        userId: owner
      }
    );
  }

  async _check(userId, appId) {
    const app = await this._appModel.findById(appId, { _id: 1, owner: 1 }).lean(); 
    if (!app) {
      this._throwError(httpStatus.BAD_REQUEST, `App with id ${appId} don't exists`);
    }

    if (!app.owner.equals(userId)) {
      this._throwError(httpStatus.FORBIDDEN, 'not allowed to generate a token for an app that is not yours');
    }
    return app;
  }

  _throwError(status, message) {
    const err = new Error(message);
    err.status = status;
    throw err;
  }
}
const httpStatus = require('http-status');

module.exports = class TokenAuth {
  constructor(modules) {
    this.handler = this.handler.bind(this);
    this.appHandler = this.appHandler.bind(this);
    this._sessionManager = modules.sessionManager;
  }

  async handler(req, res, next) {
    try {
      const authorization = this._sessionManager.retrieveHeaderToken(req);
      if (!authorization) return this._missingAuthorization(res);
      const payload = await this._sessionManager.verifyToken(authorization);
      req.user = payload.userId;
      if (req.user) return next();
      return this._invalidToken(res);
    } catch (e) {
      if (e === 'TokenExpiredError') return this._tokenExpired(res);
      if (e === 'JsonWebTokenError') return this._invalidToken(res);
      return next(e);
    }
  }

  async appHandler(req, res, next) {
    try {
      const authorization = this._sessionManager.retrieveHeaderToken(req);
      if (!authorization) return this._missingAuthorization(res);
      const payload = await this._sessionManager.verifyAppToken(authorization);
      req.user = payload.userId;
      req.app = payload.appId;
      if (req.app) return next();
      return this._invalidToken(res);
    } catch (e) {
      if (e === 'TokenExpiredError') return this._tokenExpired(res);
      if (e === 'JsonWebTokenError') return this._invalidToken(res);
      return next(e);
    }
  }

  _missingAuthorization(res) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      error: true,
      code: httpStatus.UNAUTHORIZED,
      message: 'Missing authorization'
    });
  }

  _invalidToken(res) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      error: true,
      code: httpStatus.UNAUTHORIZED,
      message: 'Invalide token'
    });
  }

  _tokenExpired(res) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      error: true,
      code: httpStatus.UNAUTHORIZED,
      message: 'Expired token'
    });
  }
};

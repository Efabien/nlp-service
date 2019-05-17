const express = require('express');
const AuthenticateUser = require('./authenticate-user');
const VerifyToken = require('./verify-token');

module.exports = class AuthenticateRoute {
  constructor(models, modules, middlwares) {
    this._authenticateUser = new AuthenticateUser(models, modules);
    this._verifyToken = new VerifyToken(models);
    this._tokenAuth = middlwares.tokenAuth;
  }

  initRoutes(app) {
    const api = express.Router();
    api.post('', this._authenticateUser.handler);
    api.get('/verify-token', this._tokenAuth.handler, this._verifyToken.handler);
    app.use('/authenticate', api);
  }
};

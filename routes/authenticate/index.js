const express = require('express');
const AuthenticateUser = require('./authenticate-user');

module.exports = class AuthenticateRoute {
  constructor(models, modules) {
    this._authenticateUser = new AuthenticateUser(models, modules);
  }

  initRoutes(app) {
    const api = express.Router();
    api.post('', this._authenticateUser.handler);
    app.use('/authenticate', api);
  }
};

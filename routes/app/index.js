const express = require('express');
const CreateApp = require('./create-app');
const GenerateToken = require('./generate-token');

module.exports = class AppRoute {
  constructor(models, middlewares, modules) {
    this._createApp = new CreateApp(models);
    this._generateToken = new GenerateToken(models, modules);
    this._tokenAuth = middlewares.tokenAuth;
  }

  initRoutes(app) {
    const api = express.Router();
    api.use(this._tokenAuth.handler);
    api.post('/create', this._createApp.handler);
    api.get('/token/:id', this._generateToken.handler);
    app.use('/app', api);
  }
}

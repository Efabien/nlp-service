const express = require('express');
const CreateApp = require('./create-app');
const GenerateToken = require('./generate-token');
const AppList = require('./app-list');

module.exports = class AppRoute {
  constructor(models, middlewares, modules) {
    this._createApp = new CreateApp(models);
    this._generateToken = new GenerateToken(models, modules);
    this._appList = new AppList(models);
    this._tokenAuth = middlewares.tokenAuth;
  }

  initRoutes(app) {
    const api = express.Router();
    api.use(this._tokenAuth.handler);
    api.get('/', this._appList.handler);
    api.post('/create', this._createApp.handler);
    api.get('/token/:id', this._generateToken.handler);
    app.use('/app', api);
  }
}

const express = require('express');
const CreateApp = require('./create-app');
const GenerateToken = require('./generate-token');
const AppList = require('./app-list');
const AppDetails = require('./app-details');
const UpdateApp = require('./update-app');

module.exports = class AppRoute {
  constructor(models, middlewares, modules) {
    this._createApp = new CreateApp(models);
    this._generateToken = new GenerateToken(models, modules);
    this._appList = new AppList(models);
    this._appDetails = new AppDetails(models);
    this._updateApp = new UpdateApp(models);
    this._tokenAuth = middlewares.tokenAuth;
  }

  initRoutes(app) {
    const api = express.Router();
    api.use(this._tokenAuth.handler);
    api.get('/', this._appList.handler);
    api.get('/details/:appId', this._appDetails.handler);
    api.patch('/update/:appId', this._updateApp.handler);
    api.post('/create', this._createApp.handler);
    api.get('/token/:appId', this._generateToken.handler);
    app.use('/app', api);
  }
}

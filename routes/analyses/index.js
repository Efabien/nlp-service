const express = require('express');
const Detection = require('./detection');
const Test = require('./test');

module.exports = class Analyses {
  constructor(models, middlewares, modules) {
    this._tokenAuth = middlewares.tokenAuth;
    this.detection = new Detection(models, modules);
    this.test = new Test(modules);
  }

  initRoutes(app) {
    const api = express.Router();
    api.use(this._tokenAuth.handler);
    api.post('/', this.detection.handler);
    api.post('/test', this.test.handler);
    app.use('/analyses', api);
  }
};

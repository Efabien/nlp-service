const express = require('express');
const Detection = require('./detection');

module.exports = class Analyses {
  constructor(models, middlewares, modules) {
    this._tokenAuth = middlewares.tokenAuth;
    this.detection = new Detection(models, modules);
  }

  initRoutes(app) {
    const api = express.Router();
    api.use(this._tokenAuth.handler);
    api.post('/', this.detection.handler);
    app.use('/analyses', api);
  }
};

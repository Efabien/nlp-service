const express = require('express');
const Detection = require('./detection');
const Test = require('./test');
const UpdateTest = require('./update-test');
const TestList = require('./test-list');

module.exports = class Analyses {
  constructor(models, middlewares, modules) {
    this._tokenAuth = middlewares.tokenAuth;
    this.detection = new Detection(models, modules);
    this.test = new Test(modules);
    this.updateTest = new UpdateTest(models, modules);
    this.testList = new TestList(models);
  }

  initRoutes(app) {
    const api = express.Router();
    api.post('/', this._tokenAuth.appHandler, this.detection.handler);
    api.post('/test', this._tokenAuth.handler, this.test.handler);
    api.patch('/test', this._tokenAuth.handler, this.updateTest.handler);
    api.get('/test', this._tokenAuth.handler, this.testList.handler);
    app.use('/analyses', api);
  }
};

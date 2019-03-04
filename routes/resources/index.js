const express = require('express');
const CreateKnowledge = require('./create-knowledge');

module.exports = class TestRoute {
  constructor(models, modules) {
    this._createKnowledge = new CreateKnowledge(models, modules);
  }

  initRoutes(app) {
    const api = express.Router();
    api.post('/create', this._createKnowledge.handler);
    app.use('/resources', api);
  }
};

const express = require('express');
const CreateKnowledge = require('./create-knowledge');
const ListKnowledge = require('./list-knowledge');
const UpdateKnowledge = require('./update-knowledge');
const DeleteKnowledge = require('./delete-knowledge');

module.exports = class ResourcesRoute {
  constructor(models, middlewares, modules) {
    this._tokenAuth = middlewares.tokenAuth;
    this._createKnowledge = new CreateKnowledge(models, modules);
    this._listKnowledge = new ListKnowledge(models);
    this._updateKnowledge = new UpdateKnowledge(models, modules);
    this._deleteKnowledge = new DeleteKnowledge(models);
  }

  initRoutes(app) {
    const api = express.Router();
    api.use(this._tokenAuth.handler);
    api.get('', this._listKnowledge.handler);
    api.post('', this._createKnowledge.handler);
    api.patch('/:id', this._updateKnowledge.handler);
    api.delete('/:id', this._deleteKnowledge.handler);
    app.use('/resources', api);
  }
};

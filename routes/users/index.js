const express = require('express');
const CreateUser = require('./create-User');

module.exports = class UserssRoute {
  constructor(models, config) {
    this._createUser = new CreateUser(models, config);
  }

  initRoutes(app) {
    const api = express.Router();
    api.post('/create', this._createUser.handler);
    app.use('/users', api);
  }
};

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

module.exports = class ExpressBootstrapper {
  constructor(middlewares) {
    this.app = express();
    this._errorHandler = middlewares.errorHandler;
    this._enableCors = middlewares.enableCors;
  }

  bootstrap() {
    this.app.use(helmet.hidePoweredBy());
    this.app.use(helmet.xssFilter());
    this.app.use(this._enableCors.handler);

    this.app.use(bodyParser.json({ limit: '11mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(this._errorHandler.handler);
  }
};

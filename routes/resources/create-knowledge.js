const httpStatus = require('http-status');
const _ = require('lodash');

module.exports = class CreateKnowledge {
  constructor(models, modules) {
    this.handler = this.handler.bind(this);

    this._knowledgeModel = models.knowledgeModel;
    this._userModel = models.userModel;
    this._resourceValidator = modules.resourceValidator;
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      data.owner = req.user;
      const knowledge = await this._knowledgeModel.create({ ...data });
      return res.status(httpStatus.OK).json({ knowledge });
    } catch (e) {
      return next(e);
    }
  }

  _validate(body) {
    return this._resourceValidator.validate(body);
  } 
};

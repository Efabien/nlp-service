const httpStatus = require('http-status');
const Joi = require('joi');

module.exports = class CreateApp {
  constructor(models) {
    this._appModel = models.appModel;
    this._subsModel = models.subscriptionModel;
    this.handler = this.handler.bind(this);

    this._schema = Joi.compile({
      name: Joi.string().required(),
      subscriptions: Joi.array().items(
        Joi.object({
          knwId: Joi.string().required(),
          intents: Joi.array().items(Joi.string().required()).required()
        }).required()
      ).required()
    });
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      const app = await this._createApp(req.user, data);
      await this._createSubs(app._id, data.subscriptions);
      return res.status(httpStatus.CREATED).json({ app });
    } catch (e) {
      return next(e);
    }
  }

  async _createApp(userId, data) {
    const result = await this._appModel.create({
      owner: userId,
      name: data.name
    });
    return result._doc;
  }

  _createSubs(appId, subs) {
    const entries = subs.map(sub => {
      return {
        owner: appId,
        knowledge: sub.knwId,
        intents: sub.intents
      }
    });
    return this._subsModel.insertMany(entries);
  }

  _validate(data) {
    const result = Joi.validate(data, this._schema);
    if (result.error) {
      const err = new Error(result.error.details[0].message);
      err.statusCode = httpStatus.BAD_REQUEST;
      throw err;
    }
    return result.value;
  }
}
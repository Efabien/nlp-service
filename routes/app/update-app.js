const Joi = require('joi');
const httpStatus = require('http-status');

module.exports = class UpdateApp {
  constructor(modeles) {
    this._subsModel = modeles.subscriptionModel;
    this.handler = this.handler.bind(this);

    this._schema = Joi.compile({
      subscriptions: Joi.array().items(
        Joi.object({
          knwId: Joi.string().required(),
          intents: Joi.array().items(Joi.string().required()).required()
        }).required()
      ).required()
    })
  }

  async handler(req, res, next) {
    try {
      const data = this._validate(req.body);
      const appId = req.params.appId;
      const { toDeleteIds, entries } = await this._diff(appId, data);
      await this._save(appId, toDeleteIds, entries);
      return res.status(httpStatus.OK).json({ toDeleteIds, entries });
    } catch (e) {
      return next(e);
    }
  }

  async _diff(appId, data) {
    const existingSubs = await this._subsModel.find(
      { owner: appId }
    ).lean();
    const toDeleteIds = this._toDelete(existingSubs, data.subscriptions);
    const entries = this._getEntries(appId, data.subscriptions);
    return { toDeleteIds, entries };
  }

  async _save(appId, toDeleteIds, entries) { 
    await this._subsModel.deleteMany({
        owner: appId, knowledge: { $in: toDeleteIds }
    });
    for (let i = 0; i < entries.length; i ++) {
      let entry = entries[i];
      await this._subsModel.update(
        { owner: entry.owner, knowledge: entry.knowledge },
        entry,
        { upsert: true }
      );
    }
    return true;
  }

  _toDelete(existingSubs, subscriptions) {
    return existingSubs
      .map(sub => sub.knowledge)
      .filter(knwId => {
        return !subscriptions.map(item => item.knwId).includes(knwId.toString());
      });
  }

  _getEntries(appId, subscriptions) {
    return subscriptions.map(sub => {
      return {
        owner: appId,
        knowledge: sub.knwId,
        intents: sub.intents
      }
    });
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
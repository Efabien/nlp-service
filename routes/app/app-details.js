const httpStatus = require('http-status');

module.exports = class AppDetails {
  constructor(models) {
    this._appModel = models.appModel;
    this._subsModel = models.subscriptionModel;
    this.handler = this.handler.bind(this);
  }

  async handler(req, res, next) {
    try {
      const app = await this._loadApp(req.params.appId, req.user);
      const subscriptions = await this._loadSubs(app._id);
      return res.status(httpStatus.OK).json({ app, subscriptions });
    } catch (e) {
      return next(e);
    }
  }

  async _loadApp(appId, userId) {
    const app = await this._appModel.findById(appId);
    if (!app) throw Error(`No app corresponding to id: ${appId}`);
    if (!app.owner.equals(userId)) throw Error(`You are trying to load an app that is not yours`);
    return app;
  }

  _loadSubs(appId) {
    return this._subsModel.find({ owner: appId });
  }
};
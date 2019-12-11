const httpStatus = require('http-status');

module.exports = class AppList {
  constructor(models) {
    this._appModel = models.appModel;
    this.handler = this.handler.bind(this);
  }

  async handler(req, res, next) {
    try {
      const apps = await this._load(req.user);
      return res.status(httpStatus.OK).json({ apps });
    } catch (e) {
      return next(e);
    }
  }

  _load(userId) {
    return this._appModel.find({ owner: userId }).lean();
  }
}
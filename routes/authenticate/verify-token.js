const httpStatus = require('http-status');
module.exports = class VerifyToken {
  constructor(models) {
    this.handler = this.handler.bind(this);
    this._userModel = models.userModel;
  }

  async handler(req, res, next) {
    try {
      const user = await this._userModel.findById(
        req.user,
        { email: 1 }
      ).lean();
      res.status(httpStatus.OK).json({ user });
    } catch (e) {
      return next(e);
    }
  }
};

const httpStatus = require('http-status');
module.exports = class TestList {
  constructor(models) {
    this._testModel = models.testModel;
    this.handler = this.handler.bind(this);
  }

  async handler(req, res, next) {
    try {
      const cases = await this._load(req.user);
      return res.status(httpStatus.OK).json({ cases });
    } catch (e) {
      return next(e);
    }
  }

  async _load(userId) {
    const tests = await this._testModel.findOne(
      { owner: userId },
      { cases: 1 }
    ).lean();
    return tests ?
      tests.cases :
      [];
  }
}
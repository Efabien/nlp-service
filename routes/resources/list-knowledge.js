const httpStatus = require('http-status');

module.exports = class ListKnowledge {
  constructor(models) {
    this.handler = this.handler.bind(this);
    this._knowledgeModel = models.knowledgeModel;
  }

  async handler(req, res, next) {
    try {
      const filter = { owner: req.user };
      if (req.query.id) filter._id = req.query.id;
      const knowledges = await this._knowledgeModel.find(
        filter,
        { '__v': 0, updatedAt: 0, owner: 0 }
      ).lean();
      return res.status(httpStatus.OK).json({ knowledges });
    } catch (e) {
      return next(e);
    }
  }
}
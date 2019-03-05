const httpStatus = require('http-status');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class DeleteKnowledge {
  constructor(models) {
    this.handler = this.handler.bind(this);

    this._knowledgeModel = models.knowledgeModel;
  }

  async handler(req, res, next) {
    try {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        const error = new Error('Bad id');
        error.status = httpStatus.BAD_REQUEST;
        throw error;
      }
      const result = await this._knowledgeModel.remove({ _id: id });
      if (!result.ok) throw new Error('knowledge not found');
      return res.status(httpStatus.OK).json(
        { ok: true, message: `knowledge with id ${id} delete successfully` }
      );
    } catch (e) {
      return next(e);
    }
  }
};

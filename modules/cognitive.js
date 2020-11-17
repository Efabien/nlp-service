const _ = require('lodash');
module.exports = class Cognitive {
  constructor(models, modules) {
    this._knModel = models.knowledgeModel;
    this._subsModel = models.subscriptionModel;
    this._brain = modules.brain;
  }

  async detect(userId, text, appId) {
    const knowledges = await this._load(userId, appId);
    const { analyse, keyWords } = this._brain.detect(text, knowledges);
    return { analyse, keyWords };
  }

  async infer(userId, text, appId) {
    const knowledges = await await this._load(userId, appId);
    let { analyse, keyWords } = this._brain.detect(text, knowledges);
    const analyseByScore = analyse.sort((a, b ) => {
      if (a.score === b.score) return 0;
      return a.score > b.score ? -1 : 1;
    }).map(item => {
      item.treshold = this._getTresholdValue(item, knowledges);
      return item;
    });

    const intent = analyseByScore.find(candidate => candidate.score >= candidate.treshold);
    keyWords = keyWords.filter(item => !!item);
    return { intent, keyWords };
  }

  async _load(userId, appId) {
    const knws = await this._knModel.find(
      { owner: userId },
      { keyWords: 1, intents: 1 }
    ).lean();
    if (!appId) return knws;
    const subs = await this._subsModel.find({ owner: appId }).lean();
    const filtered = knws.filter(knw => {
      return subs.map(sub => sub.knowledge.toString()).includes(knw._id.toString());
    });
    return filtered.map(kw => {
      let sub = subs.find(sub => sub.knowledge.equals(kw._id));
      kw.intents = _.pick(kw.intents, sub.intents)
      return kw;
    });
  }

  _getTresholdValue(candidate, knowledges) {
    const res = knowledges.map(kn => kn.intents).find(intent => {
      return !!intent[candidate.intent];
    })[candidate.intent].treshold;
    return res;
  }
}
module.exports = class Cognitive {
  constructor(models, modules) {
    this._knModel = models.knowledgeModel;
    this._brain = modules.brain;
  }

  async detect(userId, text) {
    const knowledges = await this._knModel.find(
      { owner: userId },
      { keyWords: 1, intents: 1 }
    ).lean();
    const { analyse, keyWords } = this._brain.detect(text, knowledges);
    return { analyse, keyWords };
  }

  async infer(userId, text) {
    const knowledges = await this._knModel.find(
      { owner: userId },
      { keyWords: 1, intents: 1 }
    ).lean();
    let { analyse, keyWords } = this._brain.detect(text, knowledges);
    console.log(analyse)

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

  _getTresholdValue(candidate, knowledges) {
    const res = knowledges.map(kn => kn.intents).find(intent => {
      return !!intent[candidate.intent];
    })[candidate.intent].treshold;
    return res;
  }
}
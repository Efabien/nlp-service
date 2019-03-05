const _ = require('lodash');

module.exports = class ResourceValidator {
  validate(knowledge) {
    if (!knowledge.keyWords) throw new Error('knowledge should have keywords');

    const valideKeywords = this.valdiateKeywords(knowledge.keyWords);
    if (!valideKeywords) throw new Error('keywords structures are wrong');

    if (!knowledge.intents) throw new Error('knowledge should have intents');

    const valideIntents = this.validateIntents(knowledge.intents);
    if (!valideIntents) throw new Error('Intents structures are wrong');

    return knowledge;
  }

  valdiateKeywords(keyWords) {
    const keywordsTypes = Object.keys(keyWords);
    if (!keywordsTypes.length) throw new Error('keywords should at least contain one type');

    const types = keywordsTypes.map(type => keyWords[type]);
    return types.every(type => {
      const enteries = Object.keys(type);
      if (!enteries.length) return false;
      return enteries.every(entrie => {
        return Array.isArray(type[entrie]) &&
        !!type[entrie].length &&
        type[entrie].every(entity => {
          return Array.isArray(entity) && !!entity.length && entity.every(item => item && _.isString(item));
        });
      });
    });
  }

  validateIntents(intents) {
    const intentsKeys = Object.keys(intents);
    if (!intentsKeys.length) throw new Error('knowledge should contain at least one intent');

    const enteries = intentsKeys.map(key => intents[key]);
    return enteries.every(intent => {
      return intent.texts &&
      Array.isArray(intent.texts) &&
      !!intent.texts.length &&
      intent.texts.every(text => text && _.isString(text));
    });
  }
}
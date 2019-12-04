module.exports = Object.freeze({
  APP: {
    port: process.env.PORT || 3200,
    connectionString: process.env.NLP_SERVICE_MONGO_STRING,
    saltRounds: 10,
    session: {
      privateKey: process.env.NLP_SERVICE_SESSION_KEY,
      expiration: '5d'
    }
  },
  NLP: {
    degree: 2,
    scope: 3
  },
  CONSUMER_APP: {
    session: {
      privateKey: process.env.NLP_SERVICE_APP_SESSION_KEY || 'cicada3301',
      expiration: '5y'
    }
  }
});

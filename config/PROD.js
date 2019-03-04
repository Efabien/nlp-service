module.exports = Object.freeze({
  APP: {
    port: process.env.PORT || 3200,
    connectionString: process.env.NLP_SERVICE_MONGO_STRING
  }
});

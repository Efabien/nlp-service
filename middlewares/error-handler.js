module.exports = class ErrorHandler {
  constructor() {
    this.handler = this.handler.bind(this);
  }

  handler(error, req, res, next) {
    console.log('Error during request processing', error);
    res.status(error.statusCode || 500).send(
      { message: error.message || error.errorMessage }
    );
  }
};

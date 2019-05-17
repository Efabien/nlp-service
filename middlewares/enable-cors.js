/**
 * Enable cross-origin resource sharing
 * @module
 */

const httpStatus = require('http-status');

module.exports = class EnableCorsMiddleware {
  handler(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Origin-App, X-Requested-With, Authorization, Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(httpStatus.NO_CONTENT);
    return next();
  }
};

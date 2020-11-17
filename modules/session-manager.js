const jwt = require('jsonwebtoken');

module.exports = class SessionManager {
  constructor(config) {
    this._sessionConfig = config.session;
    this._appSessionConfig = config.consumerAppSession;
  }

  signIn(data) {
    return this._sign(data, this._sessionConfig);
  }

  signInApp(data) {
    return this._sign(data, this._appSessionConfig);
  }

  _sign(payload, session) {
    return jwt.sign(payload, session.privateKey, { expiresIn: session.expiration });
  }

  verifyToken(token) {
    return this._checkToken(token, this._sessionConfig);
  }

  verifyAppToken(token) {
    return this._checkToken(token, this._appSessionConfig);
  }

  retrieveHeaderToken(req) {
    return req.headers.authorization;
  }

  _checkToken(token, session) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, session.privateKey, (err, decoded) => {
        if (err) return reject(err.name);
        return resolve(decoded);
      });
    });
  }
};

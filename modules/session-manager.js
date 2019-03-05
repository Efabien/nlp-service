const jwt = require('jsonwebtoken');

module.exports = class SessionManager {
  constructor(config) {
    this._sessionConfig = config.session;
  }

  signIn(data) {
    return this._sign(data, this._sessionConfig);
  }

  _sign(payload, session) {
    return jwt.sign(payload, session.privateKey, { expiresIn: session.expiration });
  }

  verifyToken(token) {
    return this._checkToken(token, this._sessionConfig);
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

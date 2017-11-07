'use strict';

// const CryptoJS = require('crypto-js');
const AES = require('crypto-js/aes');

module.exports = app => {
  class UserService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }
    * isValid(username, password) {
      const count = yield this.models.User.count({
        where: {
          username,
          password,
        },
      });
      return count;
    }
    * genToken(username, password) {
      const expireTime = new Date();
      expireTime.setDate(expireTime.getDate() + this.config.tokenExpireDays);
      const str = JSON.stringify({
        username,
        password,
        expireTime: expireTime.getTime(),
      });
      return AES.encrypt(str, this.config.keys).toString();
    }
  }
  return UserService;
};

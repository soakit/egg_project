'use strict';

const AES = require('crypto-js/aes');

module.exports = app => {
  class UserService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }

    async isValid(username, password) {
      // 判断用户是否active(如果需要)
      const count = await this.models.User.count({
        where: {
          username,
          password,
        },
      });
      return count;
    }

    async genToken(username, password) {
      const expireTime = new Date();
      expireTime.setDate(expireTime.getDate() + this.config.tokenExpireDays);
      const str = JSON.stringify({
        username,
        password,
        expireTime: expireTime.getTime(),
      });
      return AES.encrypt(str, this.config.keys).toString();
    }

    async getUserInfo() {
      return {
        IsManager: true,
      };
    }
  }
  return UserService;
};

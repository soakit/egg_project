'use strict';

// const CryptoJS = require('crypto-js');

module.exports = app => {
  class BaseController extends app.Controller {
    async cacheUser(username, password) {
      this.ctx.logger.info('缓存用户:', username);
      await app.redis.set(username, password);
    }
    success(data) {
      this.ctx.body = {
        code: 200,
        data,
      };
    }
    fail({ code, msg }) {
      this.ctx.body = {
        code,
        msg,
      };
    }
    notFound(msg) {
      msg = msg || 'page not found';
      this.ctx.throw(404, msg);
    }
  }
  app.Controller = BaseController;
};

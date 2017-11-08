'use strict';

// const CryptoJS = require('crypto-js');

module.exports = app => {
  class BaseController extends app.Controller {
    // constructor(ctx) {
    //   super(ctx);
    //   const req = ctx.req;
    //   if (req.url !== '/user/token') {
    //     this.validate();
    //   }
    // }
    // async validate() {
    //   const { ctx } = this;
    //   const token = ctx.req.headers['x-token'];
    //   if (!token) {
    //     ctx.logger.error('header携带x-token错误!');
    //     ctx.throw(401, '未取得授权');
    //     return;
    //   }
    //   let userObj = {};
    //   try {
    //     const bytes = CryptoJS.AES.decrypt(token, this.config.keys);
    //     userObj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    //   } catch (error) {
    //     ctx.logger.error('解析x-token错误!', error);
    //     ctx.throw(401, '未取得授权');
    //     return;
    //   }
    //   // token验证
    //   const redisPwd = await app.redis.get(userObj.username);
    //   if (userObj.password !== redisPwd) {
    //     ctx.logger.error('密码错误!');
    //     ctx.throw(401, '未取得授权');
    //     return;
    //   }
    //   if (userObj.expireTime < Date.now()) {
    //     ctx.logger.error('授权已过期!');
    //     ctx.throw(401, '未取得授权');
    //     return;
    //   }
    //   ctx.logger.info(`解析token成功，用户是${userObj.username}!`);
    //   // 权限验证
    //   await this.validateRight();
    // }
    // validateRight() {
    // }
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

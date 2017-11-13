'use strict';
const CryptoJS = require('crypto-js');
module.exports = app => {
  app.role.failureHandler = function(action) {
    this.app.logger.error('无权限访问，action为', action);
  };

  // token验证
  const validateToken = async function(ctx) {
    if (ctx.session.user && ctx.session.user.username) {
      ctx.logger.info('session中已有用户:', ctx.session.user.username);
      return ctx.session.user;
    }
    const token = ctx.request.header['x-token'];
    if (!token) {
      ctx.logger.error('header携带x-token错误!');
      ctx.throw(401, '未取得授权');
      return;
    }
    let userObj = {};
    try {
      const bytes = CryptoJS.AES.decrypt(token, ctx.app.config.keys);
      userObj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      ctx.logger.error('解析x-token错误!', error);
      ctx.throw(401, '未取得授权');
      return;
    }
    const redisPwd = await app.redis.get(userObj.username);
    if (userObj.password !== redisPwd) {
      ctx.logger.error('密码错误!');
      ctx.throw(401, '未取得授权');
      return;
    }
    if (userObj.expireTime < Date.now()) {
      ctx.logger.error('授权已过期!');
      ctx.throw(401, '未取得授权');
      return;
    }
    ctx.logger.info(`解析token成功，用户是${userObj.username}!`);
    // 设置 Session
    ctx.session.user = userObj;
    ctx.session.maxAge = 24 * 60 * 60 * 1000; // 1天
    ctx.logger.info('设置 Session:', ctx.session.user.username);
    return userObj;
  };

  /**
   * 验证token
   */
  app.role.use('validator', async function() {
    const user = await validateToken(this);
    return !!user.username;
  });
  /**
   * 验证权限
   */
  app.role.use('isManager', async function() {
    const userObj = await validateToken(this);
    if (!userObj.username) {
      return false;
    }
    const user = await this.service.user.getUserInfo(userObj.username);
    this.logger.info('用户信息:', user.username);
    return user && user.IsManager === 1;
  });
};

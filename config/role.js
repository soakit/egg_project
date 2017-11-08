'use strict';
const CryptoJS = require('crypto-js');
module.exports = app => {
  app.role.failureHandler = function(action) {
    this.app.logger.error('无权限访问，action为', action);
    this.redirect('/');
  };

  // token验证
  const validateToken = async function(ctx) {
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
    const ctx = this.app;
    const userObj = await validateToken(this);
    console.log('ctx.serviceClasses.user.getUserInfo ====>', ctx.serviceClasses.user.getUserInfo);
    const user = await ctx.config.UserService.getUserInfo(this, userObj);
    ctx.logger.info('用户信息:', user);
    return user && user.IsManager;
  });
};

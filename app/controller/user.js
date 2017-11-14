'use strict';
const md5 = require('md5');
const { statusHelper } = require('../utils/constants.js');
module.exports = app => {
  class UserController extends app.Controller {
    async getToken() {
      const { ctx, service } = this;
      const { request } = ctx;
      try {
        ctx.validate({
          username: 'string',
          password: 'string',
        }, request.body);
        let { username, password } = request.body;
        password = md5(password);
        const isValid = await service.user.isValid(username, password);
        if (isValid) {
          const data = await service.user.genToken(username, password);
          this.cacheUser(username, password);
          this.success(data);
          return;
        }
        this.fail({
          code: statusHelper.PASSWORD_ERR.code,
          msg: statusHelper.PASSWORD_ERR.desc,
        });
      } catch (error) {
        ctx.logger.error('获取token错误:', error);
        if (error) {
          if (error.code === 'invalid_param') {
            this.fail({
              code: statusHelper.PARAM_ERR.code,
              msg: statusHelper.PARAM_ERR.desc,
            });
          } else {
            this.fail({
              code: statusHelper.UNKNOWN_ERR.code,
              msg: statusHelper.UNKNOWN_ERR.desc,
            });
          }
        }
      }
    }

    async getUserInfo() {
      const { service, ctx } = this;
      this.logger.info('当前用户：', ctx.session.user.username);
      const user = await service.user.getUserInfo(ctx.session.user.username);
      this.success(user);
    }
  }
  return UserController;
};

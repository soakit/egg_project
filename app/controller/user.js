'use strict';
const md5 = require('md5');
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
          code: 4001001,
          msg: '用户名或密码不正确!',
        });
      } catch (error) {
        ctx.logger.error('获取token错误:', error);
        if (error) {
          if (error.code === 'invalid_param') {
            this.fail({
              code: 4000001,
              msg: '参数或参数类型错误!',
            });
          } else if (error.code === 'ER_NO_SUCH_TABLE') {
            this.fail({
              code: 5000001,
              msg: '没有此表!',
            });
          } else {
            this.fail({
              code: 1000000,
              msg: '未知错误!',
            });
          }
        }
      }
    }

    async getUserInfo() {
      this.logger.info('当前用户：', this.config.currentUser);
      const { service } = this;
      const user = await service.user.getUserInfo(this.config.currentUser);
      this.success(user);
    }
  }
  return UserController;
};

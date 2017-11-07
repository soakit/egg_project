'use strict';
const md5 = require('md5');
module.exports = app => {
  class UserController extends app.Controller {
    * getToken() {
      const { ctx, service } = this;
      const { request } = ctx;
      try {
        ctx.validate({
          username: 'string',
          password: 'string',
        }, request.body);
        let { username, password } = request.body;
        password = md5(password);
        const isValid = yield service.user.isValid(username, password);
        if (isValid) {
          const data = yield service.user.genToken(username, password);
          this.cacheUser(username, password);
          this.success(data);
          return;
        }
        this.fail({
          code: 4001001,
          msg: '用户名或密码不正确!',
        });
      } catch (error) {
        if (error) {
          console.log('ERROR:', error);
          if (error.code === 'invalid_param') {
            this.fail({
              code: 4000001,
              msg: '参数或参数类型错误!',
            });
            return;
          } else if (error.code === 'ER_NO_SUCH_TABLE') {
            this.fail({
              code: 5000001,
              msg: '没有此表!',
            });
            return;
          }
        }
      }
    }
  }
  return UserController;
};

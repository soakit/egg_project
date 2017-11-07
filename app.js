'use strict';

module.exports = app => {
  class BaseController extends app.Controller {
    constructor(ctx) {
      super(ctx);
      const req = ctx.req;
      if (req.url !== '/token') {
        this.validateFromCached();
      }
    }
    * validateFromCached() {
      console.log('validateFromCached:');
      // TODO:
      // const { ctx, app } = this;
      // yield app.redis.set('foo', 'bar');
      // ctx.body = yield app.redis.get('foo');
    }
    * cacheUser(StaffID, password) {
      console.log('缓存用户...');
      yield app.redis.set(StaffID, password);
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

'use strict';

const path = require('path');
const fs = require('fs');

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
    file(fileName) {
      const filePath = path.resolve(this.config.static.dir, fileName);
      this.logger.info('开始读取文件:', fileName);
      this.ctx.attachment(fileName);
      this.ctx.set('Content-Type', 'application/octet-stream');
      this.ctx.body = fs.createReadStream(filePath);
    }
    notFound(msg) {
      msg = msg || 'page not found';
      this.ctx.throw(404, msg);
    }
  }
  app.Controller = BaseController;
};

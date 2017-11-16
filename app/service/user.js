'use strict';

const AES = require('crypto-js/aes');
const sqlHelper = require('../utils/sql.js');
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

    async getUserInfo(username) {
      // 不用sql方式
      /* const row = await this.models.User.findOne({
        attributes: { exclude: [ 'password' ] },
        where: {
          username,
        },
        include: [{
          model: this.ctx.model.Menu,
        }],
      }); */
      // sql方式
      const data = await this.models.query(sqlHelper.USER_INFO(username), {
        model: this.ctx.model.User,
        raw: true,
      });
      const row = {},
        prefix = 'Permissionmenus.';
      row.Permissionmenus = [];
      data.forEach(function(item, index) {
        const obj = {};
        for (const i in item) {
          if (index === 0 && i.indexOf(prefix) === -1) {
            row[i] = item[i];
          }
          if (i.indexOf(prefix) !== -1) {
            obj[i.split(prefix)[1]] = item[i];
          }
        }
        row.Permissionmenus.push(obj);
      });
      return row;
    }
  }
  return UserService;
};

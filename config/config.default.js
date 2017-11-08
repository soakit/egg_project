'use strict';

const fs = require('fs');
const path = require('path');

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1509955660984_4087';
  config.tokenExpireDays = 3; // token有效期

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(
      path.join(appInfo.baseDir, 'app/public/favicon.ico')
    ),
  };

  config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: '0',
    },
  };

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    database: 'byd_project',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '123456',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.UserService = {
    async getUserInfo(ctx, userObj) {
      console.log('getUserInfo:', ctx, userObj);
      return {
        IsManager: true,
      };
      // Retrieve your user data from cookie, redis, db, whatever
      // For common web applications using cookie, you may get session id with ctx.cookies
    },
  };

  return config;
};

'use strict';

module.exports = app => {
  const islogin = app.role.can('admin');
  app.post('/user/token', app.controller.user.getToken);
  app.get('/user/info', app.controller.user.getUserInfo);
  app.get('/admin', islogin, 'admin.index');
};

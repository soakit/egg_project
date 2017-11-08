'use strict';

module.exports = app => {
  const isManager = app.role.can('isManager');
  const validator = app.role.can('validator');
  app.post('/user/token', app.controller.user.getToken);
  app.get('/user/info', validator, app.controller.user.getUserInfo);
  app.get('/admin', isManager, 'admin.index');
};

'use strict';

module.exports = app => {
  const isManager = app.role.can('isManager');
  const validator = app.role.can('validator');
  const lowercase = app.middlewares.lowercase();
  app.post('/user/token', lowercase, app.controller.user.getToken);
  app.get('/user/info', validator, lowercase, app.controller.user.getUserInfo);
  app.get('/admin', isManager, lowercase, 'admin.index');
};

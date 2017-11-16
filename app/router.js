'use strict';

module.exports = app => {
  const isManager = app.role.can('isManager');
  const validator = app.role.can('validator');
  app.post('/user/token', app.controller.user.getToken);
  app.get('/user/info', validator, app.controller.user.getUserInfo);

  app.get('/evaluationModule', validator, app.controller.dict.getEvaluationModule);
  app.get('/publicPriceCategory', validator, app.controller.dict.getPublicPriceCategory);

  app.get('/admin/taskprice/tree', isManager, 'admin.index');
  app.get('/admin/taskprice/list', isManager, 'admin.index');
};

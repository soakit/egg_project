'use strict';

module.exports = app => {
  const isManager = app.role.can('isManager');
  const validator = app.role.can('validator');
  const Controllers = app.controller;
  app.post('/user/token', Controllers.user.getToken);
  app.get('/user/info', validator, Controllers.user.getUserInfo);

  app.get('/evaluationModule', validator, Controllers.dict.getEvaluationModule);
  app.get('/publicPriceCategory', validator, Controllers.dict.getPublicPriceCategory);

  app.get('/admin/taskprice/tree', isManager, 'admin.index');
  app.get('/admin/taskprice/list', isManager, 'admin.index');
};

'use strict';

module.exports = app => {
  const adminValidator = app.role.can('adminValidator');
  const validator = app.role.can('validator');
  const Controllers = app.controller;
  app.post('/user/token', Controllers.user.getToken);
  app.get('/user/info', validator, Controllers.user.getUserInfo);

  app.get('/evaluationModule', validator, Controllers.dict.getEvaluationModule);
  app.get('/publicPriceCategory', validator, Controllers.dict.getPublicPriceCategory);

  app.get('/admin/taskprice/tree', adminValidator, Controllers.taskprice.getTree);
  app.get('/admin/taskprice/list', adminValidator, Controllers.taskprice.getList);
  // get时使用location
  app.get('/admin/taskprice/export', adminValidator, Controllers.taskprice.downList);
  // post时用表单提交 testDownload.html
  app.post('/admin/taskprice/export', adminValidator, Controllers.taskprice.downList);
};

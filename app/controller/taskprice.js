'use strict';

const { statusHelper } = require('../utils/constants.js');

module.exports = app => {
  class TaskpriceController extends app.Controller {
    async getList() {
      const { ctx, service } = this;
      const { request } = ctx;
      let {
        DepartmentID,
        ModuleID,
        TreeTaskUnitPriceCode,
        TaskUnitPriceCode,
        TaskUnitPriceName,
        EvaluationModuleID,
        CostBearers,
        ShowDisable,
        pageIndex,
        pageSize,
      } = request.query;
      ShowDisable = ShowDisable - 0;
      pageIndex = pageIndex - 0;
      pageSize = pageSize - 0;
      if (isNaN(ShowDisable) || isNaN(pageIndex) || isNaN(pageSize) || pageIndex <= 0 || pageSize <= 0) {
        this.fail({
          code: statusHelper.PARAM_ERR.code,
          msg: statusHelper.PARAM_ERR.desc,
        });
        return;
      }
      const modules = await service.taskprice.getList({
        DepartmentID,
        ModuleID,
        TreeTaskUnitPriceCode,
        TaskUnitPriceCode,
        TaskUnitPriceName,
        EvaluationModuleID,
        CostBearers,
        ShowDisable: !!ShowDisable,
        pageIndex,
        pageSize,
      });
      this.success(modules);
    }
    async getTree() {
      const { service } = this;
      const tree = await service.taskprice.getTree();
      this.success(tree);
    }
    async downList() {
      const { ctx, service } = this;
      const { request } = ctx;
      let {
        DepartmentID,
        ModuleID,
        TreeTaskUnitPriceCode,
        TaskUnitPriceCode,
        TaskUnitPriceName,
        EvaluationModuleID,
        CostBearers,
        ShowDisable,
      } = request.query;
      ShowDisable = ShowDisable - 0;
      if (isNaN(ShowDisable)) {
        this.fail({
          code: statusHelper.PARAM_ERR.code,
          msg: statusHelper.PARAM_ERR.desc,
        });
        return;
      }
      const name = await service.taskprice.downList({
        DepartmentID,
        ModuleID,
        TreeTaskUnitPriceCode,
        TaskUnitPriceCode,
        TaskUnitPriceName,
        EvaluationModuleID,
        CostBearers,
        ShowDisable: !!ShowDisable,
      });
      this.file(name);
    }
  }
  return TaskpriceController;
};

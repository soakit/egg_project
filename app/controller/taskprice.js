'use strict';

module.exports = app => {
  class TaskpriceController extends app.Controller {
    async getList() {
      const { service } = this;
      const modules = await service.taskprice.getList();
      this.success(modules);
    }
    async getTree() {
      const { service } = this;
      const tree = await service.taskprice.getTree();
      this.success(tree);
    }
  }
  return TaskpriceController;
};

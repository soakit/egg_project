'use strict';

module.exports = app => {
  class TaskpricesController extends app.Controller {
    async getList() {
      const { service } = this;
      const modules = await service.taskprices.getList();
      this.success(modules);
    }
  }
  return TaskpricesController;
};

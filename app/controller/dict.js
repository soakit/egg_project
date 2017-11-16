'use strict';

module.exports = app => {
  class DictController extends app.Controller {
    async getEvaluationModule() {
      const { service } = this;
      const modules = await service.dict.getEvaluationModule();
      this.success(modules);
    }
    async getPublicPriceCategory() {
      const { service } = this;
      const category = await service.dict.getPublicPriceCategory();
      this.success(category);
    }
  }
  return DictController;
};

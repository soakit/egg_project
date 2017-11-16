'use strict';

module.exports = app => {
  class DictService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }
    async getEvaluationModule() {
      const row = await this.models.Dict.findAll({
        attributes: [ 'Value', 'Label' ],
        where: {
          Type: 'Evaluation_Module',
          DelFlag: 0,
        },
        order: [
          [ 'Sort', 'ASC' ],
        ],
      });
      return row;
    }
    async getPublicPriceCategory() {
      const row = await this.models.Dict.findAll({
        attributes: [ 'Value', 'Label' ],
        where: {
          Type: 'Public_Price_Category',
          DelFlag: 0,
        },
        order: [
          [ 'Sort', 'ASC' ],
        ],
      });
      return row;
    }
  }
  return DictService;
};

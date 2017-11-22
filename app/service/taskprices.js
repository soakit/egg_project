'use strict';

module.exports = app => {
  class TaskpricesService extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.models = this.ctx.model;
    }
    async getList() {
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
  return TaskpricesService;
};

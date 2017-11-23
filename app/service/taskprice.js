'use strict';

const sqlHelper = require('../utils/sql.js');

module.exports = app => {
  class TaskpriceService extends app.Service {
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
    async getTree() {
      const data = await this.models.query(sqlHelper.TASK_PRICE_TREE(), {
        model: this.ctx.model.TaskPrice,
        raw: true,
      });
      return data;
    }
  }
  return TaskpriceService;
};

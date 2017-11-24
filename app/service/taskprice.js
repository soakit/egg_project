'use strict';

const sqlHelper = require('../utils/sql.js');
const groupBy = require('lodash/groupBy');
const uniqBy = require('lodash/uniqBy');

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
        order: [[ 'Sort', 'ASC' ]],
      });
      return row;
    }
    async getTree() {
      const row = await this.models.query(sqlHelper.TASK_PRICE_TREE(), {
        model: this.ctx.model.Dict,
        raw: true,
      });
      // 虚拟部门和模块
      const depModGroup = groupBy(row, function(item) {
        return `${item.DepartmentID}:${item.DepartmentName}_${item.ModuleID}:${item.ModuleName}`;
      });
      const data = [],
        obj = {};
      let departObj,
        modObj;
      for (const i in depModGroup) {
        const iArr = i.split('_');
        if (!obj.hasOwnProperty(iArr[0])) {
          obj[iArr[0]] = 1;
          const depArr = iArr[0].split(':');
          departObj = {
            DepartmentID: depArr[0],
            DepartmentName: depArr[1],
            value: depArr[0],
            name: depArr[1],
            children: [],
          };
          data.push(departObj);
        }
        const modArr = iArr[1].split(':');
        modObj = {
          ModuleID: modArr[0],
          ModuleName: modArr[1],
          value: modArr[0],
          name: modArr[1],
          children: [],
        };
        departObj.children.push(modObj);
      }
      // 最底层任务类型
      const allTaskTypes = uniqBy(row.filter(item => {
        return item.ParentTaskUnitPriceCode !== 'C' && item.ParentTaskUnitPriceCode !== '';
      }), 'ParentTaskUnitPriceCode');
      // 往上找到ParentTaskUnitPriceCode是C的挂在与之相关的模块下
      allTaskTypes.forEach(type => {
        const s = this.setParent(type, row, 0);
        const curDepart = data.find(item => item.DepartmentID === s.DepartmentID);
        const curModule = curDepart && curDepart.children.find(item => item.ModuleID === s.ModuleID);
        s && curModule && curModule.children.push(Object.assign({
          name: s.TaskUnitPriceName,
        }, s));
      });
      return data;
    }
    setParent(cur, row, i) {
      const parent = row.find(item => item.TaskUnitPriceCode === cur.ParentTaskUnitPriceCode);
      if (!parent) {
        return null;
      }
      if (i > 0) {
        parent.children = [];
        parent.children.push(Object.assign({
          name: cur.TaskUnitPriceName,
        }, cur));
      }
      if (parent.ParentTaskUnitPriceCode !== 'C' && parent.ParentTaskUnitPriceCode !== '') {
        i++;
        this.setParent(parent, row, i);
      }
      return parent;
    }
  }
  return TaskpriceService;
};

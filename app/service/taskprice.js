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
    async getList({
      DepartmentID,
      ModuleID,
      TreeTaskUnitPriceCode,
      TaskUnitPriceCode,
      TaskUnitPriceName,
      EvaluationModuleID,
      CostBearers,
      ShowDisable,
      pageIndex = 1,
      pageSize = 20,
    }) {
      const where = {};
      if (DepartmentID) {
        where.DepartmentID = DepartmentID;
      }
      if (ModuleID) {
        where.ModuleID = ModuleID;
      }
      const arr = [];
      if (TreeTaskUnitPriceCode) {
        where.ParentTaskUnitPriceCode = TreeTaskUnitPriceCode;
        where.TaskUnitPriceCode = {};
        arr.push({
          $eq: TreeTaskUnitPriceCode,
        });
        where.TaskUnitPriceCode.$or = arr;
      }
      if (TaskUnitPriceCode) {
        if (arr.length) {
          where.TaskUnitPriceCode.$or.push({
            $like: `%${TaskUnitPriceCode}%`,
          });
        } else {
          where.TaskUnitPriceCode = {};
          where.TaskUnitPriceCode.$like = `%${TaskUnitPriceCode}%`;
        }
      }
      if (TaskUnitPriceName) {
        where.TaskUnitPriceName = {};
        where.TaskUnitPriceName.$like = `%${TaskUnitPriceName}%`;
      }
      if (EvaluationModuleID) {
        where.EvaluationModuleID = EvaluationModuleID;
      }
      if (CostBearers) {
        where.CostBearers = {};
        where.CostBearers.$like = `%${CostBearers}%`;
      }
      if (!ShowDisable) {
        where.IsEnable = 1;
      }
      const row = await this.models.Taskprice.findAll({
        where,
        order: [
          [ 'TaskUnitPriceCode', 'ASC' ],
        ],
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize,
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
      let departObj;
      for (const i in depModGroup) {
        const iArr = i.split('_');
        const depArr = iArr[0].split(':');
        if (!obj.hasOwnProperty(iArr[0])) {
          obj[iArr[0]] = 1;
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
        departObj.children.push({
          DepartmentID: depArr[0],
          DepartmentName: depArr[1],
          ModuleID: modArr[0],
          ModuleName: modArr[1],
          value: modArr[0],
          name: modArr[1],
          children: [],
        });
      }
      // 最底层的任务类型
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
    async downList() {
      // TODO:
      return [];
    }
    setParent(cur, row, i) {
      const parent = row.find(item => item.TaskUnitPriceCode === cur.ParentTaskUnitPriceCode);
      if (!parent) {
        return null;
      }
      // 最后一层(没有子的)不展示在树上
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

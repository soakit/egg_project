'use strict';
const path = require('path');
const XLSX = require('xlsx');
const moment = require('moment');
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
        order: [[ 'TaskUnitPriceCode', 'ASC' ]],
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
        return `${
          item.DepartmentID
        }:${item.DepartmentName}_${item.ModuleID}:${item.ModuleName}`;
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
      const allTaskTypes = uniqBy(
        row.filter(item => {
          return (
            item.ParentTaskUnitPriceCode !== 'C' &&
            item.ParentTaskUnitPriceCode !== ''
          );
        }),
        'ParentTaskUnitPriceCode'
      );
      // 往上找到ParentTaskUnitPriceCode是C的挂在与之相关的模块下
      allTaskTypes.forEach(type => {
        const s = this.setParent(type, row, 0);
        const curDepart = data.find(
          item => item.DepartmentID === s.DepartmentID
        );
        const curModule =
          curDepart &&
          curDepart.children.find(item => item.ModuleID === s.ModuleID);
        s &&
          curModule &&
          curModule.children.push(
            Object.assign(
              {
                name: s.TaskUnitPriceName,
              },
              s
            )
          );
      });
      return data;
    }
    async downList() {
      const _headers = [ 'id', 'name', 'age', 'country', 'remark' ];
      const _data = [
        {
          id: '1',
          name: 'test1',
          age: '30',
          country: 'China',
          remark: 'hello',
        },
        {
          id: '2',
          name: 'test2',
          age: '20',
          country: 'America',
          remark: 'world',
        },
        {
          id: '3',
          name: 'test3',
          age: '18',
          country: 'Unkonw',
          remark: '???',
        },
      ];
      const headers = _headers
        // 为 _headers 添加对应的单元格位置
        .map((v, i) =>
          Object.assign({}, { v, position: String.fromCharCode(65 + i) + 1 })
        )
        // 转换成 worksheet 需要的结构
        .reduce(
          (prev, next) =>
            Object.assign({}, prev, { [next.position]: { v: next.v } }),
          {}
        );
      const data = _data
        // 匹配 headers 的位置，生成对应的单元格数据
        .map((v, i) =>
          _headers.map((k, j) =>
            Object.assign(
              {},
              { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) }
            )
          )
        )
        .reduce((prev, next) => prev.concat(next))
        .reduce(
          (prev, next) =>
            Object.assign({}, prev, { [next.position]: { v: next.v } }),
          {}
        );
      // 合并 headers 和 data
      const output = Object.assign({}, headers, data);
      // 获取所有单元格的位置
      const outputPos = Object.keys(output);
      // 计算出范围
      const ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
      // 构建 workbook 对象
      const wb = {
        SheetNames: [ 'mySheet' ],
        Sheets: {
          mySheet: Object.assign({}, output, { '!ref': ref }),
        },
      };
      const name = `任务单价列表_${moment().format('YYYYMMDDhhmmss')}.xlsx`;
      // 导出 Excel
      XLSX.writeFile(wb, path.resolve(this.app.config.static.dir, name));
      return name;
    }
    setParent(cur, row, i) {
      const parent = row.find(
        item => item.TaskUnitPriceCode === cur.ParentTaskUnitPriceCode
      );
      if (!parent) {
        return null;
      }
      // 最后一层(没有子的)不展示在树上
      if (i > 0) {
        parent.children = [];
        parent.children.push(
          Object.assign(
            {
              name: cur.TaskUnitPriceName,
            },
            cur
          )
        );
      }
      if (
        parent.ParentTaskUnitPriceCode !== 'C' &&
        parent.ParentTaskUnitPriceCode !== ''
      ) {
        i++;
        this.setParent(parent, row, i);
      }
      return parent;
    }
  }
  return TaskpriceService;
};

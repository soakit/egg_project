'use strict';
const path = require('path');
const moment = require('moment');
const xlsx = require('node-xlsx').default;
const utils = require('../utils/index.js').utils;
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
    }, isAll) {
      let row;
      if (!isAll) { // 分页获取
        const where = {};
        if (DepartmentID) {
          where.DepartmentID = DepartmentID;
        }
        if (ModuleID) {
          where.ModuleID = ModuleID;
        }
        if (TreeTaskUnitPriceCode) {
          where.$or = [{
            ParentTaskUnitPriceCode: {
              $eq: TreeTaskUnitPriceCode,
            },
          }, {
            ParentTaskUnitPriceCode: {
              $eq: 'C',
            },
            TaskUnitPriceCode: {
              $eq: TreeTaskUnitPriceCode,
            },
          }];
        }
        if (TaskUnitPriceCode) {
          where.TaskUnitPriceCode = {};
          where.TaskUnitPriceCode.$like = `%${TaskUnitPriceCode}%`;
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
        const condition = {
          where,
          order: [[ 'TaskUnitPriceCode', 'ASC' ]],
          raw: true,
        };

        condition.offset = (pageIndex - 1) * pageSize;
        condition.limit = pageSize;
        row = await this.models.Taskprice.findAll(condition);
      } else { // 全部
        let conditionStr = '';
        conditionStr += 'WHERE 1 = 1';
        // 拼接条件
        if (DepartmentID) {
          conditionStr += ` AND DepartmentID=${DepartmentID}`;
        }
        if (ModuleID) {
          conditionStr += ` AND ModuleID=${ModuleID}`;
        }
        if (TreeTaskUnitPriceCode) {
          conditionStr += ` AND (
            ParentTaskUnitPriceCode=${TreeTaskUnitPriceCode} OR (
              ParentTaskUnitPriceCode = 'C' AND TaskUnitPriceCode=${TreeTaskUnitPriceCode}
            )
          )`;
        }
        if (TaskUnitPriceCode) {
          conditionStr += ` AND TaskUnitPriceCode like "%${TaskUnitPriceCode}%"`;
        }
        if (TaskUnitPriceName) {
          conditionStr += ` AND TaskUnitPriceName like "%${TaskUnitPriceName}%"`;
        }
        if (EvaluationModuleID) {
          conditionStr += ` AND EvaluationModuleID=${EvaluationModuleID}`;
        }
        if (CostBearers) {
          conditionStr += ` AND CostBearers like "%${CostBearers}%"`;
        }
        if (!ShowDisable) {
          conditionStr += ' AND IsEnable=1';
        }
        row = await this.models.query(sqlHelper.TASK_PRICE(conditionStr), {
          model: this.ctx.model.Dict,
          raw: true,
        });
      }
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
    async downList(params) {
      const headers = [ '任务类型代码', '任务类型名称', '计价方式描述', '单位', '单价', '成本承担人', '项目说明', '任务完成标志', '任务交付方式', '是否需要审批', '归属任务类型代码', '归属部门', '模块', '考核归属模块', '公共单价类别', '是否需要验收', '是否需上传凭证' ];
      const dataKeys = [ 'TaskUnitPriceCode', 'TaskUnitPriceName', 'ValuationMethodDescr', 'Unit', 'Price', 'CostBearers', 'ProjectDescription', 'FinishFlag', 'DeliverWay', 'RequiredCheck', 'ParentTaskUnitPriceCode', 'DepartmentName', 'ModuleName', 'EvaluationModuleName', 'PublicPriceCategoryName', 'IsAcceptance', 'IsVerify' ];
      const list = await this.getList(params, true);
      let data = list.map(item => {
        const arr = [];
        dataKeys.forEach(key => {
          arr.push(item[key]);
        });
        return arr;
      });
      data = [ headers ].concat(data);
      const buffer = xlsx.build([{ name: '任务单价列表', data }]);
      const name = `任务单价列表_${moment().format('YYYYMMDDhhmmss')}.xlsx`;
      // 导出 Excel
      const res = await utils.writeFile(path.resolve(this.config.static.dir, name), buffer);
      if (res) {
        this.logger.error('任务单价列表写入失败:', res);
        return null;
      }
      this.logger.info('任务单价列表写入成功!');
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

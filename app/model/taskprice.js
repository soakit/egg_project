'use strict';

module.exports = app => {
  const { CHAR, TEXT, TINYINT, DATE, DECIMAL, INTEGER } = app.Sequelize;

  const TaskPrice = app.model.define('taskunitprice', {
    TaskUnitPriceID: {
      type: CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    TaskUnitPriceCode: {
      type: TEXT('long'),
    },
    TaskUnitPriceName: {
      type: TEXT('long'),
    },
    ParentTaskUnitPriceCode: {
      type: TEXT('long'),
    },
    ValuationMethodDescr: {
      type: TEXT('long'),
    },
    Unit: {
      type: TEXT('long'),
    },
    ModuleID: {
      type: TEXT('long'),
    },
    DepartmentID: {
      type: TEXT('long'),
    },
    ProjectDescription: {
      type: TEXT('long'),
    },
    FinishFlag: {
      type: TEXT('long'),
    },
    DeliverWay: {
      type: TEXT('long'),
    },
    RequiredCheck: {
      type: TINYINT,
    },
    EvaluationModuleID: {
      type: TEXT('long'),
    },
    PublicPriceCategory: {
      type: TEXT('long'),
    },
    CreateStaffID: {
      type: INTEGER(11),
    },
    CreateTime: {
      type: DATE,
    },
    UpdateStaffID: {
      type: INTEGER(11),
    },
    UpdateTime: {
      type: DATE,
    },
    IsEnable: {
      type: TINYINT(4),
    },
    Remark: {
      type: TEXT('long'),
    },
    Price: {
      type: DECIMAL(18),
    },
    TakeEffectTime: {
      type: DATE,
    },
    CommonTypeID: {
      type: TEXT('long'),
    },
    TaskTypePriceID: {
      type: CHAR(36),
    },
    IsVerify: {
      type: TINYINT(4),
    },
    IsAcceptance: {
      type: TINYINT(4),
    },
    CostBearers: {
      type: TEXT('long'),
    },
  });

  TaskPrice.associate = function() {
  };

  return TaskPrice;

};

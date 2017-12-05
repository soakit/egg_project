'use strict';

module.exports = {
  // 获取用户信息(含菜单权限)
  USER_INFO(StaffID) {
    return `
      SELECT
        Staff.StaffID AS username,
        Staff.DepartmentID,
        Staff.ChnName,
        Staff.ExchangeEmail,
        Staff.Gender,
        Staff.WxOpenID,
        Staff.DepartLocationString,
        Staff.PositionName,
        Staff.FaceImg,
        permissionmenus.MenuId AS 'Permissionmenus.MenuId',
        permissionmenus.MenuName AS 'Permissionmenus.MenuName',
        permissionmenus.MenuLevel AS 'Permissionmenus.MenuLevel',
        permissionmenus.ParentMenuId AS 'Permissionmenus.ParentMenuId',
        permissionmenus.MenuOrderNo AS 'Permissionmenus.MenuOrderNo',
        permissionmenus.Status AS 'Permissionmenus.Status',
        permissionmenus.IsDel AS 'Permissionmenus.IsDel'
      FROM
        staff AS Staff
      LEFT OUTER JOIN (
        permissionstaffmenu AS Permissionstaffmenu
          INNER JOIN permissionmenu AS Permissionmenus ON Permissionmenus.MenuId = Permissionstaffmenu.MenuId
            AND Permissionstaffmenu.StaffId = ${StaffID}
        ) ON Permissionstaffmenu.StaffId = Staff.StaffID
      WHERE
        Staff.StaffID = ${StaffID};`;
  },
  TASK_PRICE_TREE() {
    return `
      SELECT DISTINCT
        p.TaskUnitPriceCode,
        p.TaskUnitPriceName,
        p.ParentTaskUnitPriceCode,
        p.DepartmentID,
        d2.Label as DepartmentName,
        p.ModuleID,
        d1.Label as ModuleName
      FROM
        taskunitprice p
      LEFT JOIN dict AS d1 ON d1.value= p.ModuleID AND d1.type = 'Price_Module'
      LEFT JOIN dict AS d2 ON d2.value= p.DepartmentID AND d2.type = 'Price_Depart'
      `;
  },
  TASK_PRICE(condition) {
    return `
      select
        p.*,
        d.Label as ModuleName,
        e.Label as DepartmentName,
        f.Label as EvaluationModuleName,
        g.Label as PublicPriceCategoryName
      from TaskUnitPrice p
      left JOIN Dict d on p.ModuleID = d.Value and d.type = 'Price_Module'
      left JOIN Dict e on p.DepartmentID = e.Value and e.type = 'Price_Depart'
      left JOIN Dict f on p.EvaluationModuleID = f.Value and f.type = 'Evaluation_Module'
      left JOIN Dict g on p.PublicPriceCategory = g.Value and g.type = 'Public_Price_Category'
      ${condition}
      ORDER BY p.TaskUnitPriceCode
    `;
  },
};


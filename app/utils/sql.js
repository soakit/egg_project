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
        Staff.Status,
        Staff.IsManager,
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
};


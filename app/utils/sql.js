'use strict';
module.exports = {
  // 获取用户信息(含菜单权限)
  USER_INFO(StaffID) {
    return `
      SELECT
        staff.StaffID AS username,
        staff.DepartmentID,
        staff.ChnName,
        staff.ExchangeEmail,
        staff.Status,
        staff.IsManager,
        staff.Gender,
        staff.WxOpenID,
        staff.DepartLocationString,
        staff.PositionName,
        staff.FaceImg,
        permissionmenus.MenuId AS 'Permissionmenus.MenuId',
        permissionmenus.MenuName AS 'Permissionmenus.MenuName',
        permissionmenus.MenuLevel AS 'Permissionmenus.MenuLevel',
        permissionmenus.ParentMenuId AS 'Permissionmenus.ParentMenuId',
        permissionmenus.MenuOrderNo AS 'Permissionmenus.MenuOrderNo',
        permissionmenus.Status AS 'Permissionmenus.Status',
        permissionmenus.IsDel AS 'Permissionmenus.IsDel'
      FROM
        staff AS staff
      LEFT OUTER JOIN (
        permissionstaffmenu AS Permissionstaffmenu
          INNER JOIN permissionmenu AS Permissionmenus ON Permissionmenus.MenuId = Permissionstaffmenu.MenuId
            AND Permissionstaffmenu.StaffId = ${StaffID}
        ) ON Permissionstaffmenu.StaffId = staff.StaffID
      WHERE
        staff.StaffID = ${StaffID};`;
  },
};


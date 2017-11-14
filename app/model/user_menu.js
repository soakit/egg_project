'use strict';
// user与menu中间表
module.exports = app => {
  const UserMenu = app.model.define('permissionstaffmenu', {
  });

  UserMenu.associate = function() {
  };

  return UserMenu;
};

'use strict';

module.exports = app => {
  const UserMenu = app.model.define('permissionstaffmenu', {
  });

  UserMenu.associate = function() {
  };

  return UserMenu;
};

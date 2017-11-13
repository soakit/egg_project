'use strict';

module.exports = app => {
  const { STRING, BIGINT, INTEGER } = app.Sequelize;

  const Menu = app.model.define('permissionmenu', {
    MenuId: {
      type: BIGINT(11),
      allowNull: false,
      primaryKey: true,
    },
    MenuName: {
      type: STRING(50),
    },
    MenuLevel: {
      type: BIGINT(11),
    },
    ParentMenuId: {
      type: BIGINT(11),
    },
    MenuOrderNo: {
      type: BIGINT(11),
    },
    Status: {
      type: BIGINT(11),
    },
    IsDel: {
      type: INTEGER,
    },
  });

  Menu.associate = function() {
    Menu.belongsToMany(app.model.User, { through: app.model.UserMenu, foreignKey: 'MenuId' });
  };

  return Menu;

};

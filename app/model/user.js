'use strict';

module.exports = app => {
  const { STRING, BIGINT, INTEGER, TEXT } = app.Sequelize;

  const User = app.model.define('staff', {
    username: {
      field: 'StaffID',
      type: BIGINT(11),
      allowNull: false,
      primaryKey: true,
    },
    DepartmentID: {
      type: BIGINT(11),
    },
    ChnName: {
      type: STRING(50),
    },
    ExchangeEmail: {
      type: STRING(50),
      validate: {
        isEmail: true,
      },
    },
    password: {
      field: 'Md5Password',
      type: STRING(50),
    },
    // 状态
    // Status: {
    //   type: BIGINT(11),
    // },
    Gender: {
      type: BIGINT(11),
    },
    WxOpenID: {
      type: STRING(100),
    },
    DepartLocationString: {
      type: TEXT,
    },
    PositionName: {
      type: STRING(100),
    },
    FaceImg: {
      type: TEXT,
    },
  });

  User.associate = function() {
    User.belongsToMany(app.model.Menu, { through: app.model.UserMenu, foreignKey: 'StaffId' });
  };

  return User;

};

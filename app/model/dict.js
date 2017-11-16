'use strict';

module.exports = app => {
  const { STRING, BIGINT, INTEGER } = app.Sequelize;

  const Dict = app.model.define('dict', {
    DictID: {
      type: BIGINT(11),
      allowNull: false,
      primaryKey: true,
    },
    ParentID: {
      type: BIGINT(11),
    },
    Type: {
      type: STRING(100),
    },
    Label: {
      type: STRING(100),
    },
    Value: {
      type: STRING(100),
    },
    Sort: {
      type: BIGINT(11),
    },
    DelFlag: {
      type: INTEGER,
    },
  });

  Dict.associate = function() {
  };

  return Dict;

};

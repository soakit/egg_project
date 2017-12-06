'use strict';

exports.statusHelper = {
  // http status code
  NO_PERMISSION: {
    code: 401,
    desc: '未取得授权!',
  },
  // 4000001-4001000 客户端操作错误
  PARAM_ERR: {
    code: 4000001,
    desc: '参数或参数类型错误!',
  },
  // 4001001-? 客户端逻辑错误
  PASSWORD_ERR: {
    code: 4001001,
    desc: '用户名或密码不正确!',
  },
  // 5000001-? 服务端错误
  FILE_WRITE_ERR: {
    code: 5000001,
    desc: '文件写入出错!',
  },
  // 未知错误
  UNKNOWN_ERR: {
    code: 1000000,
    desc: '未知错误!',
  },
};

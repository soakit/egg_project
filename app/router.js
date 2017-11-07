'use strict';

module.exports = app => {
  app.post('/token', 'user.getToken');
};

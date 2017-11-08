'use strict';

module.exports = app => {
  class AdminController extends app.Controller {
    index() {
      this.success({
        success: true,
      });
    }
  }
  return AdminController;
};

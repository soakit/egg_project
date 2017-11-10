'use strict';
module.exports = () => {
  return function* (next) {
    const { query = {}, body = {}, method } = this.request;
    if (method === 'GET') {
      for (const i in query) {
        query[i.toString().toLowerCase()] = query[i];
      }
    } else if (method === 'POST') {
      for (const i in body) {
        body[i.toString().toLowerCase()] = body[i];
      }
    }
    yield next;
  };
};

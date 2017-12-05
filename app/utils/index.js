'use strict';

const fs = require('fs');

exports.utils = {
  writeFile(fileName, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, data, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
};

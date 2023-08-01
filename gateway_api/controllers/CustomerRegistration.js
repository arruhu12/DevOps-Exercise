'use strict';

var utils = require('../utils/writer.js');
var CustomerRegistration = require('../service/CustomerRegistrationService');

module.exports.activateAccount = function activateAccount (req, res, next, activationCode) {
  CustomerRegistration.activateAccount(activationCode)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.registerAccount = function registerAccount (req, res, next, body) {
  CustomerRegistration.registerAccount(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

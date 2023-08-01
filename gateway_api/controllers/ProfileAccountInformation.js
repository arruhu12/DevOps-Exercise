'use strict';

var utils = require('../utils/writer.js');
var ProfileAccountInformation = require('../service/ProfileAccountInformationService');

module.exports.getAccountDetails = function getAccountDetails (req, res, next) {
  ProfileAccountInformation.getAccountDetails()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAccountInfo = function getAccountInfo (req, res, next) {
  ProfileAccountInformation.getAccountInfo()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateAccountDetails = function updateAccountDetails (req, res, next, body) {
  ProfileAccountInformation.updateAccountDetails(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

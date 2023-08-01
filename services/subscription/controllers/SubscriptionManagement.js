'use strict';

var utils = require('../utils/writer.js');
var SubscriptionManagement = require('../service/SubscriptionManagementService');

module.exports.getSubscriptionPackages = function getSubscriptionPackages (req, res, next) {
  SubscriptionManagement.getSubscriptionPackages()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSubscriptionPaymentHistory = function getSubscriptionPaymentHistory (req, res, next) {
  SubscriptionManagement.getSubscriptionPaymentHistory()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSubscriptionStatus = function getSubscriptionStatus (req, res, next) {
  SubscriptionManagement.getSubscriptionStatus()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.makeCart = function makeCart (req, res, next, body) {
  SubscriptionManagement.makeCart(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.makePayment = function makePayment (req, res, next, body) {
  SubscriptionManagement.makePayment(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

'use strict';

var utils = require('../utils/writer.js');
var PurchasesTransaction = require('../service/PurchasesTransactionService');

module.exports.getPurchases = function getPurchases (req, res, next) {
  PurchasesTransaction.getPurchases()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getPurchasesTransactionById = function getPurchasesTransactionById (req, res, next, transactionId) {
  PurchasesTransaction.getPurchasesTransactionById(transactionId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.storePurchases = function storePurchases (req, res, next, body) {
  PurchasesTransaction.storePurchases(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updatePurchases = function updatePurchases (req, res, next, body) {
  PurchasesTransaction.updatePurchases(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

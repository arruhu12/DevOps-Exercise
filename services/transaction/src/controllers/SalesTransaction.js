'use strict';

var utils = require('../utils/writer.js');
var SalesTransaction = require('../service/SalesTransactionService');

module.exports.getSales = function getSales (req, res, next) {
  SalesTransaction.getSales()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSalesTransactionById = function getSalesTransactionById (req, res, next, transactionId) {
  SalesTransaction.getSalesTransactionById(transactionId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.storeSales = function storeSales (req, res, next, body) {
  SalesTransaction.storeSales(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSales = function updateSales (req, res, next, body) {
  SalesTransaction.updateSales(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

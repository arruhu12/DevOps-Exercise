'use strict';

var utils = require('../utils/writer.js');
var PurchaseAndSalesReports = require('../service/PurchaseAndSalesReportsService');

module.exports.getDashboardReport = function getDashboardReport (req, res, next) {
  PurchaseAndSalesReports.getDashboardReport()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getReports = function getReports (req, res, next, filters) {
  PurchaseAndSalesReports.getReports(filters)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getTransactionById = function getTransactionById (req, res, next, transactionId) {
  PurchaseAndSalesReports.getTransactionById(transactionId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

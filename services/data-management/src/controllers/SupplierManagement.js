'use strict';

var utils = require('../utils/writer.js');
var SupplierManagement = require('../service/SupplierManagementService');

module.exports.dropSupplier = function dropSupplier (req, res, next, supplierId) {
  SupplierManagement.dropSupplier(supplierId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSupplierById = function getSupplierById (req, res, next, supplierId) {
  SupplierManagement.getSupplierById(supplierId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSupplierList = function getSupplierList (req, res, next) {
  SupplierManagement.getSupplierList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.storeSupplier = function storeSupplier (req, res, next, body) {
  SupplierManagement.storeSupplier(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSupplierById = function updateSupplierById (req, res, next, body) {
  SupplierManagement.updateSupplierById(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

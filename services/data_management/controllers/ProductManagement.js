'use strict';

var utils = require('../utils/writer.js');
var ProductManagement = require('../service/ProductManagementService');

module.exports.dropProduct = function dropProduct (req, res, next, productId) {
  ProductManagement.dropProduct(productId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProductById = function getProductById (req, res, next, productId) {
  ProductManagement.getProductById(productId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getProductList = function getProductList (req, res, next, showNameOnly) {
  ProductManagement.getProductList(showNameOnly)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.storeProduct = function storeProduct (req, res, next, body) {
  ProductManagement.storeProduct(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateProductById = function updateProductById (req, res, next, body) {
  ProductManagement.updateProductById(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

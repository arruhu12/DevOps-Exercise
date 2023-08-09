'use strict';

var utils = require('../utils/writer.js');
var EmployeeManagement = require('../service/EmployeeManagementService');

module.exports.dropEmployee = function dropEmployee (req, res, next, employeeId) {
  EmployeeManagement.dropEmployee(employeeId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEmployees = function getEmployees (req, res, next) {
  EmployeeManagement.getEmployees()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.storeEmployee = function storeEmployee (req, res, next, body) {
  EmployeeManagement.storeEmployee(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateEmployee = function updateEmployee (req, res, next, body) {
  EmployeeManagement.updateEmployee(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

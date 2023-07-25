'use strict';


/**
 * Get Daily Reports for Dashboard
 *
 * returns inline_response_200_4
 **/
exports.getDashboardReport = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get Report of Purchases and Sales
 *
 * filters ReportFilter  (optional)
 * returns inline_response_200_5
 **/
exports.getReports = function(filters) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get Transaction Detail from Id
 *
 * transactionId String 
 * returns inline_response_200_6
 **/
exports.getTransactionById = function(transactionId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


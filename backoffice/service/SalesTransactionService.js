'use strict';


/**
 * Get Recently Recorded Sales Transaction
 *
 * returns inline_response_200_7
 **/
exports.getSales = function() {
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
 * Get Sales Transaction By Id
 *
 * transactionId String 
 * returns inline_response_200_8
 **/
exports.getSalesTransactionById = function(transactionId) {
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
 * Store Sales Transaction
 *
 * body TransactionStoreBody  (optional)
 * returns APISuccessResponse
 **/
exports.storeSales = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : true,
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Store Sales Transaction
 *
 * body Sales_update_body  (optional)
 * returns APISuccessResponse
 **/
exports.updateSales = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : true,
  "message" : "message"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


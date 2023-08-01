'use strict';


/**
 * Get list of subscription's packages
 *
 * returns SubscriptionPackageListSuccessResponse
 **/
exports.getSubscriptionPackages = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "data" : [ "", "" ],
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
 * Get History of Subscription Purchased
 *
 * returns SubscriptionHistorySuccessResponse
 **/
exports.getSubscriptionPaymentHistory = function() {
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
 * Get Subscription Status of a User
 *
 * returns SubscriptionStatusSuccessResponse
 **/
exports.getSubscriptionStatus = function() {
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
 * Store selected package to cart
 *
 * body SubscriptionCartRequest  (optional)
 * returns SubscriptionCartSuccessResponse
 **/
exports.makeCart = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "data" : "",
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
 * Make a payment for a subscription package
 *
 * body PaymentRequest  (optional)
 * returns PaymentResponse
 **/
exports.makePayment = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "transactionId" : "transactionId"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


'use strict';


/**
 * Activate a registered account
 *
 * activationCode String 
 * returns AccountActivationSuccessResponse
 **/
exports.activateAccount = function(activationCode) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "success" : true,
  "message" : "Account Activated Successfully"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Register a new account
 *
 * body RegisterAccountRequest 
 * returns APISuccessResponse
 **/
exports.registerAccount = function(body) {
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


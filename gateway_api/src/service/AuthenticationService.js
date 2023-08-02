'use strict';


/**
 * User login
 *
 * body LoginRequest 
 * returns LoginSuccessResponse
 **/
exports.login = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "data" : {
    "isNewAccount" : true,
    "isSubscriptionAction" : true,
    "accessToken" : "accessToken",
    "isActive" : true
  },
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
 * User Logout
 *
 * returns APISuccessResponse
 **/
exports.logout = function() {
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


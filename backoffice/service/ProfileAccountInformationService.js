'use strict';


/**
 * Get account details
 *
 * returns ProfileAccountResponse
 **/
exports.getAccountDetails = function() {
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
 * Update account details
 *
 * body ProfileUpdateRequest  (optional)
 * returns APISuccessResponse
 **/
exports.updateAccountDetails = function(body) {
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


var bcrypt = require('bcryptjs');
var Q = require('q');
var User = require('../app/models/user');

    // config = require('./config.js'), //config file contains all tokens and other private info
    // db = require('orchestrate')(config.db); //config.db holds Orchestrate token

//used in local-signup strategy
exports.localReg = function (username, firstName, lastName, email, avatar_url, password) {
  var deferred = Q.defer();
  var hash = bcrypt.hashSync(password, 8);
  var user = {
    "username": username,
    "firstName": firstName,
    "lastName": lastName,
    "email": email,
    "avatar_url": avatar_url,
    "password_digest": hash
  }
  //check if username is already assigned in our database
  User.findOne({ "username": user.username}, 'id username password_digest', function(err, found_user){
    if (found_user != null) {
      deferred.resolve(false);
    }
    else {
      User.create(user, function(err, created_user){
        if(err){
          deferred.reject(new Error(err));
        }
        else {
          deferred.resolve(created_user);
        }
      })
    }
  })
  return deferred.promise;
}

  //check to see if user exists
    //if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
      //if password matches take into website
  //if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
  var deferred = Q.defer();

  User.findOne({ "username": username}, 'username email password_digest avatar_url', function(err, user){
    if (user == null) {
      console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
      deferred.resolve(false);
    }
    else {
      console.log(user)
      var hash = user.password_digest
      if (bcrypt.compareSync(password, hash)) {
        deferred.resolve(user);
      } else {
        console.log("PASSWORDS DO NOT MATCH");
        deferred.resolve(false);
      }
    }
  })
  return deferred.promise;
}

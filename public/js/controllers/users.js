(function() {
  console.log("user controller initiated")
  var userControllers = angular.module('userControllers', ['ngRoute'])

  userControllers.controller('editUserController', ['User', 'AuthService', function(User, AuthService) {
    var self = this;
    AuthService.current_user().then(function(response){
      self.user = [response.data]
    });
  }]);

})();

(function() {
  var userControllers = angular.module('userControllers', ['ngRoute'])

  userControllers.controller('editUserController', ['User', 'AuthService', '$window', function(User, AuthService, $window) {
    var self = this;
    AuthService.current_user().then(function(response){
      self.user = [response.data]
    });
    this.updateUser = function(){
      User.update({id: self.user[0]._id}, self.user[0], function(response){
        $window.location.reload()
      })
    }
    this.resetUser = function(){
      this.editToggle = !this.editToggle;
      AuthService.current_user().then(function(response){
        self.user = [response.data]
      });
    }

  }]);

})();

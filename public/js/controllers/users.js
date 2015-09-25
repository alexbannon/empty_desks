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

  userControllers.controller('searchController', ['User', 'Desk', 'AuthService', "$routeParams", "$http", function(User, Desk, AuthService, $routeParams, $http) {
    var self = this;
    AuthService.current_user().then(function(response){
      self.user = [response.data]
    });
    this.desks = Desk.query();
    this.search_term = $routeParams.search_term;
    $http.get("/api/search/"+this.search_term).then(function(response){
      self.search_results = response;
      self.desk_results = response.data[1].desks
      self.user_results = response.data[0].users
    })
  }]);

  userControllers.controller("userShowController", ['User', 'Desk', '$routeParams', '$location', 'AuthService', function(User, Desk, $routeParams, $location, AuthService) {
    var self = this;
    this.user = User.get({id: $routeParams.id})
    AuthService.current_user().then(function(response){
      if($routeParams.id == response.data._id){
        $location.path("/profile")
      }
    });
  }])

})();

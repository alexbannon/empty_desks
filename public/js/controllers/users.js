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

  userControllers.controller("userShowController", ['User', 'Desk', '$routeParams', '$location', 'AuthService', '$scope', function(User, Desk, $routeParams, $location, AuthService, $scope) {
    var self = this;
    this.user = User.get({id: $routeParams.id})
    AuthService.current_user().then(function(response){
      if($routeParams.id == response.data._id){
        $location.path("/profile")
      }
    });
    this.desks = Desk.query();
    this.updateDesk = function(item){
      Desk.get({id: item}, function(desk){
        var desk = desk;
        var keep_going = true;
        desk.users.forEach(function(user){
          if(user == self.user._id){
            keep_going = false;
            return;
          }
        })
        if(keep_going == false){
          self.$error = "User Already A Member of that Desk"
        }
        else{
          desk.users.push(self.user._id)
          desk.$update({id: item})
          self.$error = ""
        }
      })
    }
  }])

})();

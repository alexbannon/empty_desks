(function() {
  var deskControllers = angular.module('deskControllers', ['ngRoute'])

  // index controller
  deskControllers.controller('desksController', ['Desk', function(Desk) {
    this.desks = Desk.query();
  }]);

  deskControllers.controller('newDeskController', ['Desk', 'AuthService', function(Desk, AuthService){
    this.newDesk;
    AuthService.current_user();
    AuthService.$scope.current_user
    this.current_user = AuthService.current_user;
    this.createDesk = function(){
      var object = $cookies.getAll();
      for(key in object){
        console.log(object[key])
      }
      Desk.save()
      console.log("created desk");
    }
  }])

  deskControllers.controller('homeController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])


})();

(function() {
  var deskControllers = angular.module('deskControllers', ['ngRoute'])

  // index controller
  deskControllers.controller('desksController', ['Desk', function(Desk) {
    this.desks = Desk.query();
  }]);

  deskControllers.controller('newDeskController', ['Desk', 'AuthService', function(Desk, AuthService){
    var self = this;
    this.newDesk = {};
    AuthService.current_user().then(function(response){
      self.newDesk.users = [response.data]
    })
    this.createDesk = function(){
      Desk.save(this.newDesk, function(desk){
        console.log(desk)
      })
    }
  }])

  deskControllers.controller('showDeskController', ['Desk', '$routeParams', function(Desk, $routeParams){
    this.desk = Desk.get({id: $routeParams.id});
    console.log(this.desk)
  }])

  deskControllers.controller('homeController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])


})();

(function() {
  var deskControllers = angular.module('deskControllers', ['ngRoute'])

  // index controller
  deskControllers.controller('desksController', ['Desk', function(Desk) {
    this.desks = Desk.query();
  }]);

  deskControllers.controller('newDeskController', ['Desk', 'AuthService', '$location', function(Desk, AuthService, $location){
    var self = this;
    this.newDesk = {};
    AuthService.current_user().then(function(response){
      self.newDesk.users = [response.data._id]
    })
    this.createDesk = function(){
      Desk.save(this.newDesk, function(desk){
        $location.path("/desk/"+desk._id)
      })
    }
  }])

  deskControllers.controller('showDeskController', ['Desk', '$routeParams', function(Desk, $routeParams){
    var self = this;
    this.desk = Desk.get({id: $routeParams.id}, function(desk){
      self.desk.lists = desk.lists
    });
    this.newListTitle = "";
    this.newList = function(){
=      if(self.newListTitle == "" || !self.newListTitle){
        return
      }
      else {
        var obj = {}
        obj["listName"] = self.newListTitle;
        obj["items"] = [];
        this.desk.lists.push(obj)
        this.desk.$update({id: self.desk._id})
      }
    }
    // this.newList = function(){
    //   if(self.desks.lists){
    //     console.log(self.desks.lists)
    //   }
    //   else {
    //     self.desks.lists = [{this.newListTitle: []}]
    //   }
    //   this.desk.$addToDesk({id: this.desk._id})
    // }
  }])

  deskControllers.controller('homeController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])

  deskControllers.controller('deskCalendarController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])


})();

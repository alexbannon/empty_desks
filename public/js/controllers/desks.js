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
      if(!this.newDesk.title || !this.newDesk.description){
        this.showError = true;
        return;
      }
      else{
        Desk.save(this.newDesk, function(desk){
          $location.path("/desk/"+desk._id)
        })
      }
    }
  }])

  deskControllers.controller('showDeskController', ['Desk', '$routeParams', '$location', function(Desk, $routeParams, $location){
    var self = this;
    this.desk = Desk.get({id: $routeParams.id}, function(desk){
      self.desk.lists = desk.lists
    });
    this.newListTitle = "";
    this.newList = function(){
      if(self.newListTitle == "" || !self.newListTitle){
        return
      }
      else {
        var obj = {}
        obj["listName"] = self.newListTitle;
        obj["items"] = [];
        this.desk.lists.push(obj)
        console.log(this.desk.lists)
        this.desk.$update({id: self.desk._id})
      }
    }
    this.deleteDesk = function(){
      this.desk.$delete({id: this.desk._id});
      $location.path("/desks")
    }
  }])

  deskControllers.controller('homeController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])

  deskControllers.controller('deskCalendarController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])


})();

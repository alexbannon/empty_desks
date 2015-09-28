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

  deskControllers.controller('showDeskController', ['Desk', 'User', '$routeParams', '$location', function(Desk, User, $routeParams, $location){
    var self = this;
    this.desk = Desk.get({id: $routeParams.id}, function(desk){
      self.desk.lists = desk.lists
    });
    this.users = User.query();
    this.newListTitle = "";
    this.newList = function(){
      if(self.newListTitle == "" || !self.newListTitle){
        self.$error_message = "Title Cannot Be Blank";
        return
      }
      var complete = true;
      self.desk.lists.forEach(function(list){
        if (list.listName == self.newListTitle) {
          self.$error_message = "List Already Exists";
          self.newListTitle = "";
          complete = false;
        }
      })
      if (complete == false){
        return
      }
      else {
        var obj = {}
        obj["listName"] = self.newListTitle;
        obj["items"] = [];
        this.desk.lists.push(obj)
        console.log(this.desk.lists)
        this.desk.$update({id: self.desk._id})
        self.newListTitle = "";
        self.$error_message = "";
      }
    }
    this.deleteDesk = function(){
      this.desk.$delete({id: this.desk._id});
      $location.path("/desks")
    }
    this.addListItem = function(){
      var self = this;
      self.desk.lists.forEach(function(list){
        if(list.newItem){
          var keep_going = true;
          list.items.forEach(function(item){
            console.log(item)
            console.log(list.newItem)
            if(item == list.newItem){
              keep_going = false;
              return
            }
          })
          if(keep_going == false){
            self.$item_error_message = "Item Already Exists";
            list.newItem = ""
            return
          }
          else{
            list.items.push(list.newItem);
            self.desk.$update({id: self.desk._id})
            self.$item_error_message = "";
            list.newItem = ""
          }
        }
      })
    }
    this.deleteItem = function(listItem, listName){
      console.log(listItem, listName)
      this.desk.lists.forEach(function(list){
        if(list["listName"] == listName){
          list.items.forEach(function(item){
            if(item == listItem){
              console.log(item)
            }
          })
        }
      })
    }
    this.deleteList = function(inputName){
      var self = this;
      for(var i = 0; i < self.desk.lists.length; i++){
        var obj = self.desk.lists[i];
        if(inputName.indexOf(obj.listName) != -1){
          self.desk.lists.splice(i, 1);
        }
      }
      self.desk.$update({id: self.desk._id})

    }

    this.addListToCalendar = function(listName){
      console.log(listName)
    }

  }])

  deskControllers.controller('homeController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])

  deskControllers.controller('deskCalendarController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])


})();

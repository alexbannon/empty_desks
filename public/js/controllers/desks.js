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

  deskControllers.controller('showDeskController', ['Desk', 'User', '$routeParams', '$location', 'AuthService', '$scope', function(Desk, User, $routeParams, $location, AuthService, $scope){
    var self = this;
    this.desk = Desk.get({id: $routeParams.id}, function(desk){
      self.desk.lists = desk.lists
    });
    this.users = User.query();
    this.newListTitle = "";
    this.avatars = [];
    var init = function() {
      Desk.get({id: $routeParams.id}, function(desk){
        desk.users.forEach(function(user){
          User.get({id: user}, function(user){
            if(user.avatar_url){
              var obj = {}
              obj["avatar_image"] = user.avatar_url;
              obj["userId"] = user._id;
              self.avatars.push(obj)
            }
            else{
              var first_letter = user.username.slice(0,1)
              var obj = {}
              obj["avatar_image"] = first_letter;
              obj["userId"] = user._id
              self.avatars.push(obj)
            }
          })
        })
      });
    }
    init();

    this.user_avatars = this.users.forEach(function(user){
      User.get({id: user}, function(user){

      })
    })

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
        obj["dueDate"] = null;
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
      var self = this;
      this.desk.lists.forEach(function(list){
        if(list["listName"] == listName){
          for(var i = 0; i < list.items.length; i++){
            if(list.items[i] == listItem){
              list.items.splice(i, 1);
              self.desk.$update({id: self.desk._id})
            }
          }
        }
      })
    }
    this.deleteList = function(inputName, index){
      var self = this;
      console.log(self.desk.lists[index])
      if(self.desk.lists[index].listName == inputName){
        self.desk.lists.splice(index, 1);
        self.desk.$update({id: self.desk._id})
      }
      else{
        console.log("error")
      }
    }

    this.addListToCalendar = function(index){
      this.desk.$update({id: self.desk._id})
    }

    this.addComment = function(){
      var self = this;
      AuthService.current_user().then(function(response){
        var userId = [response.data._id]
        console.log(response.data)
        var obj = {};
        obj["userId"] = userId[0]
        obj["comment"] = self.newComment
        if(response.data.avatar_url){
          obj["picture"] = response.data.avatar_url
        }
        else if(response.data.firstName){
          console.log(response.data.firstName)
          var first_letter = response.data.firstName.slice(0,1)
          obj["letter"] = first_letter
        }
        else{
          var first_letter = response.data.username.slice(0,1)
          obj["letter"] = first_letter
        }
        self.desk.comments.push(obj)
        self.desk.$update({id: self.desk._id})
        self.newComment = ""
      })

    }

    this.deleteComment = function(comment, index){
      self.desk.comments.splice(index, 1);
      self.desk.$update({id: self.desk._id})
    }

  }])

  deskControllers.controller('homeController', ['Desk', function(Desk){
    this.desks = Desk.query();
  }])

})();

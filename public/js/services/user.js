(function() {
  var userServices = angular.module('userServices', []);

  userServices.factory( 'AuthService', [ '$http', function($http) {
    return {
      current_user: function(){
        return $http.get("/api/confirm/current_user")
        .success(function(response){
          return response
        })
      }
    }
  }])

  userServices.factory('User', ['$resource', function($resource) {
    return $resource('/api/users/:id', {}, {
      update: {method:'PUT'}
    });
  }]);
  
})();

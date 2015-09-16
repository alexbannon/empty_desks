(function() {
  var userServices = angular.module('userServices', []);

  userServices.factory( 'AuthService', [ '$http', function($http) {
    return {
      current_user: function(){
        var request = $http.get("/api/confirm/current_user")
        .success(function(userId) {
          $scope.current_user = userId;
          return userId
        })
      }
    }
  }])
})();

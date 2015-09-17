(function(){
  var router = angular.module('userRouter', []);
  router.config([
    '$routeProvider',
    function($routeProvider){
      $routeProvider.
      when("/profile", {
        templateUrl: "views/users/profile.html",
        controller: 'editUserController',
        controllerAs: 'editUserCtrl'

      })
    }
  ])
})();

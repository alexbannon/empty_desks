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

      }).
      when("/search_results/:search_term", {
        templateUrl: "views/users/search_results.html",
        controller: 'searchController',
        controllerAs: 'searchCtrl'
      })
    }
  ])
})();

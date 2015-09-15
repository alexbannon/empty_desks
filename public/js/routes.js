(function(){
  var router = angular.module('deskRouter', []);
  router.config([
    '$routeProvider',
    function($routeProvider){
      $routeProvider.
      when("/desks", {
        templateUrl: 'views/desks/index.html',
        controller: 'desksController',
        controllerAs: 'deskCtrl'
      })
    }
  ])
})();

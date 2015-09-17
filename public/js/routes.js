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
      }).
      when("/", {
        templateUrl: 'views/home/userHomepage.html',
        controller: 'homeController',
        controllerAs: 'homeCtrl'
      }).
      when("/desks/new", {
        templateUrl: "views/desks/new.html",
        controller: 'newDeskController',
        controllerAs: 'newDeskCtrl'
      }).
      when("/desk/:id", {
        templateUrl: "views/desks/show.html",
        controller: 'showDeskController',
        controllerAs: 'showDeskCtrl'
      }).
      when("/calendar", {
        templateUrl: "views/desks/calendar.html",
        controller: 'deskCalendarController',
        controllerAs: 'calCtrl'
      })
    }
  ])
})();

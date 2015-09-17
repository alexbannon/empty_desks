(function(){
  var directives = angular.module('deskDirectives',[]);
  directives.directive('deskIndex', ['Desk', 'User', '$routeParams', '$location', function(Desk, User, $routeParams, $location){
    return {
      templateUrl: "views/partials/_desk_index.html",
      restrict: "MACE",
      link: function(scope, element, attributes){
        if($routeParams.id){
          scope.showing = true;
          scope.desk = Desk.get({id: $routeParams.id});
        }
      }
    }
  }]);
})();

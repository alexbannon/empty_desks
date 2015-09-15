(function() {
  var deskServices = angular.module('deskServices', ['ngResource']);

  deskServices.factory('Desk', ['$resource', function($resource) {
    return $resource('/api/desks/:id', {}, {
      update: {method:'PUT'}
    });
  }]);
})();

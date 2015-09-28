(function() {
  var calendarServices = angular.module('calendarServices', ['ngResource']);

  calendarServices.factory('Calendar', ['$resource', function($resource) {
    return $resource('/api/calendar/:id', {}, {
      update: {method:'PUT'}
    });
  }]);
})();

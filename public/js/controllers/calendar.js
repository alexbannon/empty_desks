(function() {
  var calendarControllers = angular.module('calendarControllers', ['ngRoute'])

  calendarControllers.controller('showCalendarController', ['Desk', function(Desk) {
    this.desks = Desk.query();
  }]);

})();

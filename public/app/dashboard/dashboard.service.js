(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('DashboardService', DashboardService)

    DashboardService.$inject = ['$firebaseObject', '$firebaseArray', 'DataService'];

    function DashboardService($firebaseObject, $firebaseArray, DataService) {

          var service = {
              addEvent: addEvent,
              loadUser: loadUser,
              loadEvent: loadEvent,
              loadEvents: loadEvents,
              updateEvent: updateEvent
          };

          return service;

          function addEvent(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              $firebaseArray(DataService.root.ref('profiles/'+ obj.profile_id + '/calendar/events/'))
              .$add({title: obj.title, start: obj.start, end: obj.end, allDay: obj.allDay})
              .then(function(res) {
                  DataService.root.ref('profiles/'+ obj.profile_id + '/calendar/events/'+ res.key +'/').update({id: res.key});
              });
          }

          function loadUser(id) {
              return $firebaseObject(DataService.root.ref('users/'+ id));
          }

          function loadEvent(obj) {
              return $firebaseObject(DataService.root.ref('profiles/'+ obj.profile_id + '/calendar/events/'+ obj.id +'/'))
          }

          function loadEvents(id) {
              return $firebaseArray(DataService.root.ref('profiles/'+ id + '/calendar/events/'))
          }

          function updateEvent(obj) {
              obj.date_updated = firebase.database.ServerValue.TIMESTAMP;
              DataService.root.ref('profiles/'+ obj.profile_id + '/calendar/events/'+ obj.id + '/')
              .update({title: obj.title, start: obj.start, end: obj.end, allDay: obj.allDay});
          }

    }

})();

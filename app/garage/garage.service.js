(function() {
    'use strict';

    angular
        .module('app.garage')
        .factory('carsService', carsService)

    carsService.$inject = ['$firebaseArray', '$firebaseObject'];

    function carsService($firebaseArray, $firebaseObject) {

          var root = firebase.database();

          var service = {
              cars: cars,
              addCar: addCar,
              removeCar: removeCar,
              car: car,
              index: index,
              key: key,
          };

          return service;

          function cars() {
              return $firebaseArray(root.ref('cars/'));
          }

          function addCar(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              return $firebaseArray(root.ref('cars/')).$add(obj).then(function(ref){
                  return ref.key;
              });
          }
          function removeCar(id) {
              return root.ref('cars/'+ id).remove();
          }
          function car(id) {
              return $firebaseObject(root.ref('cars/'+ id));
          }
          function index(id) {
              return $firebaseArray(root.ref('cars/')).$indexFor(id);
          }
          function key(key) {
              return $firebaseArray(root.ref('cars/')).$keyAt(key);
          }
    }

})();

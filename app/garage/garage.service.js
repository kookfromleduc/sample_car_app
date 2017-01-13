(function() {
    'use strict';

    angular
        .module('app.garage')
        .factory('carsService', carsService)

    carsService.$inject = ['$firebaseArray', '$firebaseObject'];

    function carsService($firebaseArray, $firebaseObject) {

          var root = firebase.database();

          var service = {
              root: root,
              cars: cars,
              addCar: addCar,
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
              return root.cars.$add(obj).then(function(ref){
                  return ref.key;
              });
          }
          function removeCar(id) {
              return root.ref('cars/'+ id).remove();
          }
          function car(id) {
              return $firebaseObject(firebase.database().ref('cars/'+ id));
          }
          function index(id) {
              return root.cars.$indexFor(id);
          }
          function key(key) {
              return root.cars.$keyAt(key);
          }
    }

})();

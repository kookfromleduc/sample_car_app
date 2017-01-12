(function() {
    'use strict';

    angular
        .module('app.price_list')
        .factory('PriceListService', PriceListService)

    PriceListService.$inject = ['$firebaseArray', '$firebaseObject', 'DataService'];

    function PriceListService($firebaseArray, $firebaseObject, DataService) {

          var service = {
              price_list: price_list,
              addPrice: addPrice,
              price: price,
              categoryPrices: categoryPrices,
              index: index,
              key: key,
          };

          return service;

          function price_list() {
              return $firebaseArray(DataService.root.ref('price_list/').orderByChild('view_status').equalTo(true));
          }

          function addPrice(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              return DataService.price_list.$add(obj).then(function(ref){
                  return ref.key;
              });
          }
          function removePrice(id) {
              return DataService.root.ref('price_list/'+ id).update( {view_status: false} )
          }
          function price(id) {
              return $firebaseObject(firebase.database().ref('price_list/'+ id));
          }
          function categoryPrices(category) {
              return $firebaseArray(DataService.root.ref('price_list/').orderByChild('category').equalTo(category));
          }
          function index(id) {
              return DataService.price_list.$indexFor(id);
          }
          function key(key) {
              return DataService.price_list.$keyAt(key);
          }
    }

})();

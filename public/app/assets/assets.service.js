(function() {
    'use strict';

    angular
        .module('app.assets')
        .factory('AssetService', AssetService)

    AssetService.$inject = ['$firebaseArray', '$firebaseObject', 'DataService'];

    function AssetService($firebaseArray, $firebaseObject, DataService) {

          var service = {
              assets: assets,
              industryGroups: industryGroups,
              addAsset: addAsset,
              asset: asset,
              index: index,
              key: key,
          };

          return service;

          function assets() {
              return $firebaseArray(DataService.root.ref('assets/').orderByChild('view_status').equalTo(true));
          }
          function industryGroups() {
              return DataService.industry_groups;
          }
          function addAsset(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              return DataService.assets.$add(obj).then(function(ref){
                  return ref.key;
              });
          }
          function removeAsset(id) {
              return DataService.root.ref('assets/'+ id).update( {view_status: false} )
          }
          function asset(id) {
              return $firebaseObject(firebase.database().ref('assets/'+ id));
          }
          function index(id) {
              return DataService.assets.$indexFor(id);
          }
          function key(key) {
              return DataService.assets.$keyAt(key);
          }
    }

})();

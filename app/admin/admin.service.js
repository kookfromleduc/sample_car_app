(function() {
    'use strict';

    angular
        .module('app.admin')
        .factory('AdminService', AdminService);

    AdminService.$inject = ['$firebaseObject'];

    function AdminService($firebaseObject) {

        var service = {
            createUser: createUser,
            getUser: getUser,
            updateUserType: updateUserType
        };

        return service;

        function createUser(obj) {
            firebase.database().ref('users/' + obj.uid).set({email: obj.email, profile_id: obj.profile_id, type: obj.type});
        }

        function getUser(id) {
            return $firebaseObject(firebase.database().ref('users/' + id));
        }

        function updateUserType(obj) {
            firebase.database().ref('users/' + obj.uid).update({type: obj.type});
        }

    }

})();

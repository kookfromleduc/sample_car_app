(function() {
    'use strict';

     angular
        .module('app.auth')
        .controller('AuthCtrl', AuthCtrl);

        AuthCtrl.$inject = ['$state', '$scope', 'AuthService', 'AdminService', 'ProfileService'];

        function AuthCtrl($state, $scope, AuthService, AdminService, ProfileService) {
            var vm = this;
            var obj = {};

            vm.error = null;

            vm.registerUser = function() {
                if (vm.user.password == vm.user.confirm_password) {
                    return AuthService.profileCheck(vm.user.email).$loaded().then(function(res) {
                        if (res[0] != undefined) {
                            obj = {};
                            obj.profile_id = res[0].$id;
                            obj.type = res[0].type;
                            obj.email = vm.user.email;
                            return AuthService.createUserEmailPassword(vm.user).then(function(res) {
                                obj.uid = res.uid;
                                AdminService.createUser(obj);
                                $state.go('account.dashboard');
                            });
                        } else {
                            console.log('E-mail is not valid');
                        };
                    })
                } else {
                    console.log('Passwords Do Not Match');
                };
            }

            vm.login = function() {
                return AuthService.login(vm.user).then(function(authData) {
                    $state.go('account.dashboard');
                })
                .catch(function(error) {
                    vm.error = error;
                });
            }

        }

})();

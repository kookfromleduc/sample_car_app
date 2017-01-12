(function() {
    'use strict';

    angular
        .module('app.account')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

            .state('account', {
                abstract: true,
                url: '/account',
                controller: 'AccountCtrl as vm',
                templateUrl: 'app/account/account.html',
                resolve: { authData: resolveUser }
            })

            .state('account.dashboard', {
                url: '/dashboard',
                views: {
                    "header@account": {
                        templateUrl: 'app/dashboard/dashboard.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/dashboard/dashboard.menu.html'
                    },
                    "list@account.dashboard": {
                        controller: 'DashboardCtrl as vm',
                        templateUrl: 'app/dashboard/dashboard.html'
                    }
                }
            })
            .state('account.user-profile', {
                url: '/user-profile',
                views: {
                    "header@account": {
                        templateUrl: 'app/account/user-profile.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/account/user-profile.menu.html'
                    },
                    "list@account.user-profile": {
                        controller: 'UserProfileCtrl as vm',
                        templateUrl: 'app/account/user-profile.html'
                    }
                }
            })

        }

        resolveUser.$inject = ['AuthService', '$state'];

        function resolveUser(AuthService, $state) {
            return AuthService.authObject.$requireSignIn();
        }

})();

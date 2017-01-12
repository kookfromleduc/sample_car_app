(function() {
    'use strict';

    angular
        .module('app.tools')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

            .state('account.tools', {
                url: '/tools',
                views: {
                    "header@account": {
                        templateUrl: 'app/tools/tools.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/tools/tools.menu.html'
                    },
                    "list@account.tools": {
                        controller: 'ImportAssetsCtrl as vm',
                        templateUrl: 'app/tools/import-assets.html'
                    }
                }
            })
            .state('account.tools.import-price-list', {
                url: '/import-price-list',
                views: {
                    "header@account": {
                        templateUrl: 'app/tools/import-price-list.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/tools/tools.menu.html'
                    },
                    "list@account.tools.import-price-list": {
                        controller: 'ImportPricesCtrl as vm',
                        templateUrl: 'app/tools/import-price-list.html'
                    }
                }
            })
            .state('account.tools.import-contacts', {
                url: '/import-contacts',
                views: {
                    "header@account": {
                        templateUrl: 'app/tools/import-contacts.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/tools/tools.menu.html'
                    },
                    "list@account.tools.import-contacts": {
                        controller: 'ImportContactsCtrl as vm',
                        templateUrl: 'app/tools/import-contacts.html'
                    }
                }
            })
            .state('account.tools.import-companies', {
                url: '/import-companies',
                views: {
                    "header@account": {
                        templateUrl: 'app/tools/import-companies.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/tools/tools.menu.html'
                    },
                    "list@account.tools.import-companies": {
                        controller: 'ImportCompaniesCtrl as vm',
                        templateUrl: 'app/tools/import-companies.html'
                    }
                }
            })
        }

})();

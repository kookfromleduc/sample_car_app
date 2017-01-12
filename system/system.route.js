(function() {
    'use strict';

    angular
        .module('app.system')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

            .state('account.system', {
                url: '/system',
                views: {
                    "header@account": {
                        templateUrl: 'app/system/system.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/system/system.menu.html'
                    },
                    "list@account.system": {
                        controller: 'ProfilesCtrl as vm',
                        templateUrl: 'app/system/profiles.html'
                    }
                }
            })
            .state('account.system.profile', {
                url: '/profile',
                params: {
                    rowEntity: null,
                    uid: null
                },
                views: {
                    "header@account": {
                        templateUrl: 'app/system/profile.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/system/system.menu.html'
                    },
                    "list@account.system.profile": {
                        controller: 'ProfileCtrl as vm',
                        templateUrl: 'app/system/profile.html'
                    }
                }
            })
            .state('account.system.customer', {
                url: '/customer',
                params: {
                    rowEntity: null,
                    uid: null
                },
                views: {
                    "header@account": {
                        templateUrl: 'app/system/customer.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/system/system.menu.html'
                    },
                    "list@account.system.customer": {
                        controller: 'CustomerSetupCtrl as vm',
                        templateUrl: 'app/system/customer.html'
                    }
                }
            })
            .state('account.system.activity', {
                url: '/activity',
                params: {
                    rowEntity: null
                },
                views: {
                    "header@account": {
                        templateUrl: 'app/system/activity.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/system/system.menu.html'
                    },
                    "list@account.system.activity": {
                        controller: 'ActivitySetupCtrl as vm',
                        templateUrl: 'app/system/activity.html'
                    }
                }
            })
            .state('account.system.template', {
                url: '/template',
                views: {
                    "header@account": {
                        templateUrl: 'app/system/template.header.html'
                    },
                    "menu@account": {
                        templateUrl: 'app/system/system.menu.html'
                    },
                    "list@account.system.template": {
                        controller: 'TemplateCtrl as vm',
                        templateUrl: 'app/system/template.html'
                    }
                }
            })
        }

})();

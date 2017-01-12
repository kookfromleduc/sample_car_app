(function() {
    'use strict';

    angular
        .module('app.activities')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

                .state('account.activities', {
                    url: '/activities',
                    views: {
                        "header@account": {
                            templateUrl: 'app/activities/activities.header.html'
                        },
                        "menu@account": {
                            templateUrl: 'app/activities/activities.menu.html'
                        },
                        "list@account.activities": {
                            controller: 'ActivitiesCtrl as vm',
                            templateUrl: 'app/activities/activities.html'
                        }
                    }
                })
                .state('account.activity', {
                    url: '/activity',
                    params: {
                        rowEntity: null
                    },
                    views: {
                        "header@account": {
                            templateUrl: 'app/activities/activity.header.html'
                        },
                        "menu@account": {
                            templateUrl: 'app/activities/activities.menu.html'
                        },
                        "list@account.activity": {
                            controller: 'ActivityCtrl as vm',
                            templateUrl: 'app/activities/activity.html'
                        }
                    }
                })
                .state('account.activity.discovery', {
                    url: '/discovery',
                    params: {
                        rowEntity: null
                    },
                    views: {
                        "header@account": {
                            templateUrl: 'app/activities/activity.header.html'
                        },
                        "menu@account": {
                            templateUrl: 'app/activities/activities.menu.html'
                        },
                        "list@account.activity.discovery": {
                            controller: 'DiscoveryCtrl as vm',
                            templateUrl: 'app/activities/activity.discovery.html'
                        }
                    }
                })
                .state('account.activity.proposal', {
                    url: '/proposal',
                    params: {
                        rowEntity: null
                    },
                    views: {
                        "header@account": {
                            templateUrl: 'app/activities/activity.header.html'
                        },
                        "menu@account": {
                            templateUrl: 'app/activities/activities.menu.html'
                        },
                        "list@account.activity.proposal": {
                            controller: 'ProposalCtrl as vm',
                            templateUrl: 'app/activities/activity.proposal.html'
                        }
                    }
                })
                .state('account.activity.quote', {
                    url: '/quote',
                    params: {
                        rowEntity: null
                    },
                    views: {
                        "header@account": {
                            templateUrl: 'app/activities/activity.header.html'
                        },
                        "menu@account": {
                            templateUrl: 'app/activities/activities.menu.html'
                        },
                        "list@account.activity.quote": {
                            controller: 'QuoteCtrl as vm',
                            templateUrl: 'app/activities/activity.quote.html'
                        }
                    }
                })
                .state('account.activity.order', {
                    url: '/order',
                    params: {
                        rowEntity: null
                    },
                    views: {
                        "header@account": {
                            templateUrl: 'app/activities/activity.header.html'
                        },
                        "menu@account": {
                            templateUrl: 'app/activities/activities.menu.html'
                        },
                        "list@account.activity.order": {
                            controller: 'OrderCtrl as vm',
                            templateUrl: 'app/activities/activity.order.html'
                        }
                    }
                })


        }

})();

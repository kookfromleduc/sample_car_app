(function() {
    'use strict';

    angular
        .module('app.customers')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

            .state('account.customers', {
                url: '/customers',
                views: {
                  "header@account": {
                      templateUrl: 'app/customers/customers.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/customers/customers.menu.html'
                  },
                  "list@account.customers": {
                        controller: 'ContactsCtrl as vm',
                        templateUrl: 'app/customers/contacts.html'
                  }
                }
            })
            .state('account.customers.company', {
                url: '/company',
                params: {
                    rowEntity: null,
                    cid: null
                  },
                views: {
                  "header@account": {
                      templateUrl: 'app/customers/company.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/customers/customers.menu.html'
                  },
                  "list@account.customers.company": {
                        controller: 'CompanyCtrl as vm',
                        templateUrl: 'app/customers/company.html'
                  }
                }
            })
            .state('account.customers.companies', {
                url: '/companies',
                views: {
                  "header@account": {
                      templateUrl: 'app/customers/companies.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/customers/customers.menu.html'
                  },
                  "list@account.customers.companies": {
                        controller: 'CompaniesCtrl as vm',
                        templateUrl: 'app/customers/companies.html'
                  }
                }
            })
            .state('account.customers.contact', {
                url: '/contact',
                params: {
                    rowEntity: null,
                    cid: null
                  },
                views: {
                  "header@account": {
                      templateUrl: 'app/customers/contact.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/customers/customers.menu.html'
                  },
                  "list@account.customers.contact": {
                        controller: 'ContactCtrl as vm',
                        templateUrl: 'app/customers/contact.html'
                  }
                }
            })
        }

})();

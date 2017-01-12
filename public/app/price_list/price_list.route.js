(function() {
    'use strict';

    angular
        .module('app.price_list')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

            .state('account.price_list', {
                url: '/price_list',
                views: {
                  "header@account": {
                      templateUrl: 'app/price_list/price_list.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/price_list/price_list.menu.html'
                  },
                  "list@account.price_list": {
                        controller: 'PriceListCtrl as vm',
                        templateUrl: 'app/price_list/price_list.html'
                  }
                }
            })
            .state('account.price_list.price', {
                url: '/price',
                params: {
                    rowEntity: null,
                  },
                views: {
                  "header@account": {
                      templateUrl: 'app/price_list/price.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/price_list/price_list.menu.html'
                  },
                  "list@account.price_list.price": {
                        controller: 'PriceCtrl as vm',
                        templateUrl: 'app/price_list/price.html'
                  }
                }
            })
        }

})();

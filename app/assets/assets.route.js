(function() {
    'use strict';

    angular
        .module('app.assets')
        .config(configFunction);

        configFunction.$inject = ['$stateProvider'];

        function configFunction($stateProvider) {

            $stateProvider

            .state('account.assets', {
                url: '/assets',
                views: {
                  "header@account": {
                      templateUrl: 'app/assets/assets.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/assets/assets.menu.html'
                  },
                  "list@account.assets": {
                        controller: 'AssetsCtrl as vm',
                        templateUrl: 'app/assets/assets.html'
                  }
                }
            })
            .state('account.assets.asset', {
                url: '/asset',
                params: {
                    rowEntity: null,
                  },
                views: {
                  "header@account": {
                      templateUrl: 'app/assets/asset.header.html'
                  },
                  "menu@account": {
                      templateUrl: 'app/assets/assets.menu.html'
                  },
                  "list@account.assets.asset": {
                        controller: 'AssetCtrl as vm',
                        templateUrl: 'app/assets/asset.html'
                  }
                }
            })
        }

})();

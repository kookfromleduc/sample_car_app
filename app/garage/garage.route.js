(function() {
    'use strict';

    angular
        .module('app.garage')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider

        .state('garage', {
            url: '/',
            controller: 'carsCtrl as vm',
            templateUrl: 'app/garage/garage.html'

        })

        .state('garage.car', {
            url: '/car',
            params: {
                rowEntity: null,
              },
            controller: 'carCtrl as vm',
            templateUrl: 'app/garage/car.html'
        })

    }

})();

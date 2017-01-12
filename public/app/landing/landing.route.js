(function() {
    'use strict';

    angular
        .module('app.landing')
        .config(configFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider.state('landing', {
            url: '/',
            templateUrl: 'app/landing/landing.html'
        });
    }

})();

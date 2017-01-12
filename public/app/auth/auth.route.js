(function() {
    'use strict';

    angular
        .module('app.auth')
        .config(configFunction)
//        .run(runFunction);

    configFunction.$inject = ['$stateProvider'];

    function configFunction($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            controller: 'AuthCtrl as vm',
            templateUrl: 'app/auth/login.html'
        })

        $stateProvider.state('register', {
            url: '/register',
            controller: 'AuthCtrl as vm',
            templateUrl: 'app/auth/register.html'
        })
    }

})();

function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider

        .state('/', {
            url: "/",
            templateUrl: "app/landing/landing.html",
            data: { pageTitle: 'Spectrum Sales', specialClass: 'landing-page' }
        });

}
angular
    .module('app')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });

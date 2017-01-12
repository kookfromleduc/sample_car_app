(function() {
    'use strict';

    var app = angular.module('app', [
        'firebase',
        'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.cellNav',
        'ui.grid.selection',
        'ui.grid.importer',
        'ngSanitize',
        'dndLists',
        'ngFileUpload',
        'ui.tinymce',
        'ui.calendar',
        'app.auth',
        'app.landing',
    ])

    .config(configFunction)
    .run(runFunction);

    configFunction.$inject = ['$urlRouterProvider'];

    function configFunction($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

    runFunction.$inject = ['$rootScope', '$state'];

    function runFunction($rootScope, $state) {
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            if (error === "AUTH_REQUIRED") {
                $state.go('landing');
            }
        });
    }

})();

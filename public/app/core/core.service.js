(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('DataService', DataService)

    DataService.$inject = ['$firebaseArray', '$firebaseObject'];

    function DataService($firebaseArray, $firebaseObject) {

        var root = firebase.database();

        var service = {
            root: root,
            companies: $firebaseArray(root.ref('companies/')),
            assets: $firebaseArray(root.ref('assets/')),
            price_list: $firebaseArray(root.ref('price_list')),
            contacts: $firebaseArray(root.ref('contacts/')),
            contact_staging: $firebaseArray(root.ref('contact_staging')),
            activities: $firebaseArray(root.ref('activities/')),
            activities_deleted: $firebaseArray(root.ref('activities_deleted')),
            profiles: $firebaseArray(root.ref('profiles/')),
            industry_groups: $firebaseArray(root.ref('industry_groups/')),
            business_units: $firebaseArray(root.ref('business_units/')),
            regions: $firebaseArray(root.ref('regions/')),
            preferences: $firebaseArray(root.ref('preferences/')),
            kpis: $firebaseArray(root.ref('kpis/')),
            revenue_groups: $firebaseArray(root.ref('revenue_groups/')),
            sales_activities: $firebaseArray(root.ref('sales_activities/')),
            business_questions: $firebaseArray(root.ref('business_questions/')),
            solution_questions: $firebaseArray(root.ref('solution_questions/')),
            quote: $firebaseObject(root.ref('quote_template/')),
            order: $firebaseObject(root.ref('order_template/')),
            template_images: $firebaseObject(root.ref('template_images/')),
            services: $firebaseArray(root.ref('quote_template/services')),
            transportation: $firebaseArray(root.ref('quote_template/transportation')),


        };

        return service;
    }

})();

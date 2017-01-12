(function() {
    'use strict';

    angular
        .module('app.tools')
        .factory('ContactImportService', ContactImportService)

    ContactImportService.$inject = ['$firebaseArray', '$firebaseObject', 'DataService'];

    function ContactImportService($firebaseArray, $firebaseObject, DataService) {
        var service = {
            contacts: contacts,
            contact_staging: contact_staging,
            addStagedContact: addStagedContact,
            removeStagedContact: removeStagedContact,


        };

        return service;


        function contacts() {
            return $firebaseArray(DataService.root.ref('contacts/').orderByChild('view_status').equalTo(true));
        }

        function contact_staging() {
            return DataService.contact_staging;
        }

        function companyRef(obj) {
            return $firebaseArray(DataService.root.ref('companies').orderByChild('name').equalTo(obj.company_name));
        }

        function addStagedContact(obj) {
            DataService.root.ref('contacts/'+ obj.$id).set({first_name: obj.first_name,
                last_name: obj.last_name, business_phone: obj.business_phone,
                cell_phone: obj.cell_phone, date_added: obj.date_added,
                view_status: true, email: obj.email,
                company_name: obj.company_name, fax: obj.fax,
                address1: obj.address1, city: obj.city,
                province: obj.province, postal_code: obj.postal_code,
                country: obj.country, group: obj.group,
                job_title: obj.job_title, primaryCompany_id: obj.primaryCompany_id});
            DataService.root.ref('contacts/'+ obj.$id + '/companies/' + obj.company_id ).set({name: obj.company_name, date_added: obj.date_added});
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.$id).set({date_added: obj.date_added});
        }

        function removeStagedContact(email) {
            DataService.root.ref('contact_staging/').orderByChild('email').equalTo(email).remove();
        }


    }
})();

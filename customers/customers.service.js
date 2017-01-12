(function() {
    'use strict';

    angular
        .module('app.customers')
        .factory('CompanyService', CompanyService)
        .factory('ContactService', ContactService)
        .service('ContactLoadPreferences', ContactLoadPreferences)
        .service('ContactLoadKpis', ContactLoadKpis)

    CompanyService.$inject = ['$firebaseArray', '$firebaseObject', 'DataService'];

    function CompanyService($firebaseArray, $firebaseObject, DataService) {
        var service = {
            companies: companies,
            newCompany: newCompany,
            removeCompany: removeCompany,
            company: company,
            addAddress: addAddress,
            address: address,
            addresses: addresses,
            updatePrimaryContact: updatePrimaryContact,
            updateAddressCount: updateAddressCount,
            recountAddresses: recountAddresses,
            removeAddress: removeAddress,
            companyContacts: companyContacts,
            contactCheck: contactCheck,
            newContactToCompany: newContactToCompany,
            removeContactFromCompany: removeContactFromCompany,
            index: index,
            key: key,
            contacts: contacts,
            updateCompany: updateCompany,
            addContactAndCompany: addContactAndCompany
        };

        return service;

        function companies() {
            return $firebaseArray(DataService.root.ref('companies').orderByChild('view_status').equalTo(true));
        }

        function newCompany(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            return DataService.companies.$add(obj).then(function(res) {
                return res.key;
            });
        }

        function removeCompany(id) {
            DataService.root.ref('companies/' + id).update({view_status: false});
        }

        function company(id) {
            return $firebaseObject(DataService.root.ref('companies/'+ id));
        }

        function addresses(id) {
            return $firebaseArray(DataService.root.ref('companies/'+ id +'/addresses'));
        }

        function address(obj) {
            return $firebaseObject(DataService.root.ref('companies/'+ obj.id +'/addresses/'+ obj.aid));
        }

        function addAddress(obj) {
            return DataService.root.ref('companies/'+ obj.id +'/addresses').push({priority: obj.cnt});
            DataService.root.ref('companies/'+ obj.id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function updatePrimaryContact(obj) {
            DataService.root.ref('companies/'+ obj.company_id).update({primaryContact_id: obj.contact_id});
            DataService.root.ref('companies/'+ obj.company_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function addContactAndCompany(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id).set({uid: obj.uid, date_added: obj.date_added});
            DataService.root.ref('contacts/'+ obj.contact_id + '/companies/' + obj.company_id).set({uid: obj.uid, name: obj.name, date_added: obj.date_added});
        }

        function updateAddressCount(obj) {
            DataService.root.ref('companies/'+ obj.id).update({address_count: obj.cnt});
            DataService.root.ref('companies/'+ obj.id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function recountAddresses(obj) {
            var cnt = 1;
            var data = $firebaseArray(DataService.root.ref('companies/'+ obj.id +'/addresses/').orderByChild("priority")).$loaded().then(function() {
                for(var i = 0; i < data.length; i++) {
                    DataService.root.ref('companies/'+ id +'/addresses/'+ data[i].$id).update({priority: cnt});
                    cnt = cnt + 1;
                }
            });
            DataService.root.ref('companies/'+ obj.id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function removeAddress(obj) {
            DataService.root.ref('companies/'+ obj.id +'/addresses/'+ obj.aid).remove();
            return recountAddresses(obj);
        }

        function companyContacts(id) {
            return $firebaseArray(DataService.root.ref('companies/'+ id + '/contacts').orderByPriority());
        }

        function contactCheck(obj) {
            return DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id);
        }

        function newContactToCompany(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            DataService.root.ref('contacts/'+ obj.contact_id).update({primaryCompany_id: obj.company_id});
            DataService.root.ref('contacts/'+ obj.contact_id + '/companies/' + obj.company_id).set({uid: obj.uid, name: obj.company_name, date_added: obj.date_added});
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id).set({uid: obj.uid, date_added: obj.date_added});
            DataService.root.ref('contacts/'+ obj.contact_id).update({date_updated: obj.date_added});
            DataService.root.ref('companies/'+ obj.company_id).update({date_updated: obj.date_added});
        }

        function removeContactFromCompany(obj) {
            DataService.root.ref('contacts/'+ obj.contact_id + '/companies/' + obj.company_id).remove();
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id).remove();
            DataService.root.ref('contacts/'+ obj.contact_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
            DataService.root.ref('companies/'+ obj.company_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function index(id) {
            return DataService.companies.$indexFor(id);
        }

        function key(key) {
            return DataService.companies.$keyAt(key);
        }

        function contacts() {
            return DataService.contacts;
        }

        function updateCompany(obj) {
            return DataService.root.ref('companies/'+ obj.company_id).update({group: obj.group, region: obj.region, business_unit: obj.business_unit,
                ranking: obj.ranking, region: obj.region, address1: obj.address1, address2: obj.address2, city: obj.city, province: obj.province,
                postal_code: obj.postal_code, country: obj.country, primaryContact_id: obj.contact_id});
        }

    }

    ContactService.$inject = ['$firebaseArray', '$firebaseObject', 'DataService'];

    function ContactService($firebaseArray, $firebaseObject, DataService) {
        var service = {
            addContact: addContact,
            removeContact: removeContact,
            contact: contact,
            contacts: contacts,
            index: index,
            key: key,
            industryGroups: industryGroups,
            regions: regions,
            companies: companies,
            contactCompanies: contactCompanies,
            companyCheck: companyCheck,
            addCompanyToContact: addCompanyToContact,
            updatePrimaryCompany: updatePrimaryCompany,
            removeCompanyFromContact: removeCompanyFromContact,
            contactPreferences: contactPreferences,
            contactPreference: contactPreference,
            contactSetPreference: contactSetPreference,
            contactUpdatePreferencePriority: contactUpdatePreferencePriority,
            contactUpdatePreferenceNote: contactUpdatePreferenceNote,
            contactRemovePreference: contactRemovePreference,
            contactPreferencesSnapShot: contactPreferencesSnapShot,
            preference: preference,
            preferencesSnapShot: preferencesSnapShot,
            contactKpis: contactKpis,
            contactKpi: contactKpi,
            contactSetKpi: contactSetKpi,
            contactUpdateKpiPriority: contactUpdateKpiPriority,
            contactUpdateKpiNote: contactUpdateKpiNote,
            contactRemoveKpi: contactRemoveKpi,
            contactKpisSnapShot: contactKpisSnapShot,
            kpi: kpi,
            kpisSnapShot: kpisSnapShot,
            updateBusinessAnswer: updateBusinessAnswer,
            updateSolutionAnswer: updateSolutionAnswer,
            addContactNote: addContactNote,
            notes: notes,
            contactDocs: contactDocs,
            addDoc: addDoc,
            removeDoc: removeDoc,
            updatePrimaryContact: updatePrimaryContact
        };

        return service;

        function contacts() {
            return $firebaseArray(DataService.root.ref('contacts/').orderByChild('view_status').equalTo(true));
        }

        function addContact(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            return DataService.contacts.$add(obj).then(function(ref){
                return ref.key;
            });
        }

        function updatePrimaryCompany(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            DataService.root.ref('contacts/'+ obj.contact_id).update({primaryCompany_id: obj.company_id, company_name: obj.company_name});
            DataService.root.ref('contacts/'+ obj.contact_id + '/companies/' + obj.company_id).set({uid: obj.uid, name: obj.company_name, date_added: obj.date_added});
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id).set({uid: obj.uid, date_added: obj.date_added});
            DataService.root.ref('companies/'+ obj.company_id).update({date_updated: obj.date_added});
            DataService.root.ref('contacts/'+ obj.contact_id).update({date_updated: obj.date_added});
        }

        function removeContact(id) {
            return DataService.root.ref('contacts/' + id).update({view_status: false});
        }

        function contact(id) {
            return $firebaseObject(DataService.root.ref('contacts/'+ id));
        }

        function contactCompanies(id) {
            return $firebaseArray(DataService.root.ref('contacts/'+ id + '/companies').orderByPriority());
        }

        function companyCheck(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/companies/').child(obj.company_id);
        }

        function addCompanyToContact(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            DataService.root.ref('contacts/'+ obj.contact_id + '/companies/' + obj.company_id).set({uid: obj.uid, name: obj.name, date_added: obj.date_added});
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id).set({uid: obj.uid, date_added: obj.date_added});
            DataService.root.ref('contacts/'+ obj.contact_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
            DataService.root.ref('companies/'+ obj.company_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function removeCompanyFromContact(obj) {
            DataService.root.ref('contacts/'+ obj.contact_id + '/companies/' + obj.company_id).remove();
            DataService.root.ref('companies/'+ obj.company_id + '/contacts/' + obj.contact_id).remove();
            DataService.root.ref('contacts/'+ obj.contact_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
            DataService.root.ref('companies/'+ obj.company_id).update({date_updated: firebase.database.ServerValue.TIMESTAMP});
        }

        function index(id) {
            return DataService.contacts.$indexFor(id);
        }

        function key(key) {
            return DataService.contacts.$keyAt(key);
        }

        function industryGroups() {
            return DataService.industry_groups;
        }

        function regions() {
            return DataService.regions;
        }

        function companies() {
            return DataService.companies;
        }

        function contactPreferences(id) {
             return $firebaseArray(DataService.root.ref('contacts/'+ id + '/preferences').orderByChild('priority'));
        }

        function contactPreference(obj) {
            return $firebaseObject(DataService.root.ref('contacts/'+ obj.contact_id +'/preferences/'+ obj.key));
        }

        function contactSetPreference(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/preferences/'+ obj.key).set({priority: obj.cnt, label: obj.label, notes: obj.notes});
        }

        function contactUpdatePreferencePriority(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/preferences/'+ obj.key).update({priority: obj.cnt});
        }

        function contactUpdatePreferenceNote(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/preferences/'+ obj.key).update({notes: obj.notes});
        }

        function contactRemovePreference(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/preferences/'+ obj.key).remove();
        }

        function contactPreferencesSnapShot(id) {
            return DataService.root.ref('contacts/'+ id + '/preferences').orderByPriority();
        }

        function preference(obj) {
            return $firebaseObject(DataService.root.ref('preferences/'+ obj.key));
        }

        function preferencesSnapShot() {
            return DataService.root.ref('preferences').orderByPriority();
        }

        function contactKpis(id) {
            return $firebaseArray(DataService.root.ref('contacts/'+ id + '/kpis').orderByChild('priority'));
        }

        function contactKpi(obj) {
            return $firebaseObject(DataService.root.ref('contacts/'+ obj.contact_id +'/kpis/'+ obj.key));
        }

        function contactSetKpi(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/kpis/'+ obj.key).set({priority: obj.cnt, label: obj.label, notes: obj.notes});
        }

        function contactUpdateKpiPriority(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/kpis/'+ obj.key).update({priority: obj.cnt});
        }

        function contactUpdateKpiNote(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/kpis/'+ obj.key).update({notes: obj.notes});
        }

        function contactRemoveKpi(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id + '/kpis/'+ obj.key).remove();
        }

        function contactKpisSnapShot(id) {
            return DataService.root.ref('contacts/'+ id + '/kpis').orderByPriority();
        }

        function kpi(obj) {
            return $firebaseObject(DataService.root.ref('kpis/'+ obj.key));
        }

        function kpisSnapShot() {
            return DataService.root.ref('kpis').orderByPriority();
        }

        function addContactNote(obj) {
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            return DataService.root.ref('contacts/'+ obj.contact_id + '/notes/').push({note: obj.note, date_added: obj.date_added, type: obj.type});
        }

        function notes(id) {
            return $firebaseArray(DataService.root.ref('contacts/'+ id + '/notes').orderByChild('date_added'));
        }

        function updateBusinessAnswer(obj) {
            DataService.root.ref('contacts/'+ obj.id + '/business_answers/'+ obj.name).update({answer: obj.answer, date_updated: obj.date,
              time_updated: obj.time});
        }

        function updateSolutionAnswer(obj) {
            DataService.root.ref('contacts/'+ obj.id + '/solution_answers/'+ obj.name).update({answer: obj.answer, date_updated: obj.date,
                time_updated: obj.time});
        }

        function contactDocs(id) {
            return $firebaseArray(DataService.root.ref('contacts/'+ id + '/docs/'));
        }

        function addDoc(obj) {
            if (obj.icon === undefined) obj.icon = 'fa-file-o';
            obj.date_added = firebase.database.ServerValue.TIMESTAMP;
            return DataService.root.ref('contacts/'+ obj.contact_id + '/docs/').push({name: obj.name, url: obj.url, type: obj.content_type,
                total_bytes: obj.total_bytes, activity_id: obj.activity_id, icon: obj.icon, date_added: obj.date_added});
        }

        function removeDoc(obj) {
            DataService.root.ref('contacts/'+ obj.contact_id + '/docs/'+ obj.doc_id).remove();
        }

        function updatePrimaryContact(obj) {
            return DataService.root.ref('contacts/'+ obj.contact_id).update({job_title: obj.job_title, first_name: obj.first_name, last_name: obj.last_name,
                email: obj.email, cell_phone: obj.cell_phone, business_phone: obj.business_phone});
        }

    }

    ContactLoadPreferences.$inject = ['ContactService'];

    function ContactLoadPreferences(ContactService) {
        this.initiate = function (id) {
            var cnt = 1;
            var obj = {};
            //preference load - initial and addtional adds
            ContactService.preferencesSnapShot().once('value').then(function(res) {
                res.forEach(function(snapShotChild) {
                    obj = {};
                    obj.contact_id = id;
                    obj.key = snapShotChild.getKey();
                    ContactService.contactPreference(obj).$loaded().then(function(res) {
                        if (res.$value === null) {
                            obj.cnt = cnt;
                            obj.key = res.$id;
                            obj.notes = null;
                            obj.label = snapShotChild.val().label;
                            ContactService.contactSetPreference(obj);
                            cnt = cnt + 1;
                        }
                    });
                });

            });
            // if preference has been removed from system settings
            ContactService.contactPreferencesSnapShot(id).once('value').then(function(res) {
                res.forEach(function(snapShotChild) {
                    obj = {};
                    obj.contact_id = id;
                    obj.key = snapShotChild.getKey();
                    ContactService.preference(obj).$loaded().then(function(res) {
                        if (res.$value === null) {
                            obj.key = res.$id;
                            ContactService.contactRemovePreference(obj);
                        }
                    });
                });
            });

            cnt = 1;
            ContactService.contactPreferences(id).$loaded().then(function(res) {
                for(var i = 0; i < res.length; i++) {
                    obj.key = res[i].$id;
                    obj.contact_id = id;
                    if (res[i].priority === null) {
                        cnt = res.length + 1;
                    } else {
                        obj.cnt = cnt;
                    }
                    ContactService.contactUpdatePreferencePriority(obj);
                    cnt = cnt + 1;
                };
            });

        }

    }

    ContactLoadKpis.$inject = ['ContactService'];

    function ContactLoadKpis(ContactService) {
        this.initiate = function (id) {
            var cnt = 1;
            var obj = {};
            ContactService.kpisSnapShot().once('value').then(function(res) {
                res.forEach(function(snapShotChild) {
                    obj = {};
                    obj.contact_id = id;
                    obj.key = snapShotChild.getKey();
                    ContactService.contactKpi(obj).$loaded().then(function(res) {
                        if (res.$value === null) {
                            obj.cnt = cnt;
                            obj.key = res.$id;
                            obj.notes = null;
                            obj.label = snapShotChild.val().label;
                            ContactService.contactSetKpi(obj);
                            cnt = cnt + 1;
                        }
                    });
                });
            });
            ContactService.contactKpisSnapShot(id).once('value').then(function(res) {
                res.forEach(function(snapShotChild) {
                    obj = {};
                    obj.contact_id = id;
                    obj.key = snapShotChild.getKey();
                    ContactService.kpi(obj).$loaded().then(function(res) {
                        if (res.$value === null) {
                            obj.key = res.$id;
                            ContactService.contactRemoveKpi(obj);
                        }
                    });
                });
            });

            cnt = 1;
            ContactService.contactKpis(id).$loaded().then(function(res) {
                for(var i = 0; i < res.length; i++) {
                    obj.key = res[i].$id;
                    obj.contact_id = id;
                    if (res[i].priority === null) {
                        cnt = res.length + 1;
                    } else {
                        obj.cnt = cnt;
                    }
                    ContactService.contactUpdateKpiPriority(obj);
                    cnt = cnt + 1;
                };
            });
        }
    }

})();

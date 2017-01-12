(function() {
    'use strict';

     angular
        .module('app.tools')
        .controller('ImportAssetsCtrl', ImportAssetsCtrl)
        .controller('ImportPricesCtrl', ImportPricesCtrl)
        .controller('ImportContactsCtrl', ImportContactsCtrl)
        .controller('ImportCompaniesCtrl', ImportCompaniesCtrl)

        ImportAssetsCtrl.$inject = ['$state', '$scope', 'DataService'];

        function ImportAssetsCtrl($state, $scope, DataService) {
            var vm = this;
            var mobileView = 992;

            vm.data = [];
            $scope.data = [];

            vm.gridImportAssets = {
                multiSelect: true,
                showGridFooter: true,
                enableGridMenu: true,
                enableSorting: false,
                enableColumnMenus: false,
                enableCellEditOnFocus: true,
                data: 'data',
                importerDataAddCallback: function ( grid, newObjects ) {
                    $scope.data = $scope.data.concat( newObjects );
                },
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.rowEdit.on.saveRow($scope, function(rowEntity) {
                        DataService.price_list.$add({$priority: rowEntity.Priority, name: rowEntity.ItemName,
                        code: rowEntity.ItemCode, unit_number: rowEntity.UnitNumber,
                        status: 'Enabled', date_added: firebase.database.ServerValue.TIMESTAMP,
                        view_status: true});
                    });
                }
            };

        }

        ImportPricesCtrl.$inject = ['$state', '$scope', 'DataService'];

        function ImportPricesCtrl($state, $scope, DataService) {
            var vm = this;
            var mobileView = 992;

            vm.data = [];
            $scope.data = [];

            vm.gridImportPriceList = {
                multiSelect: true,
                showGridFooter: true,
                enableGridMenu: true,
                enableSorting: false,
                enableColumnMenus: false,
                enableCellEditOnFocus: true,
                data: 'data',
                importerDataAddCallback: function ( grid, newObjects ) {
                    $scope.data = $scope.data.concat( newObjects );
                },
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.rowEdit.on.saveRow($scope, function(rowEntity) {
                        DataService.price_list.$add({$priority: rowEntity.Priority, name: rowEntity.Name,
                        description: rowEntity.Description, category: rowEntity.Category,
                        power_output: rowEntity.PowerOutput, day_rate: rowEntity.DayRate,
                        week_rate: rowEntity.WeekRate, four_week_rate: rowEntity.FourWeekRate,
                        status: 'Enabled', date_added: firebase.database.ServerValue.TIMESTAMP,
                        view_status: true});
                    });
                }
            };

        }

        ImportContactsCtrl.$inject = ['$state', '$scope', '$firebaseArray', 'DataService', 'ContactImportService'];

        function ImportContactsCtrl($state, $scope, $firebaseArray, DataService, ContactImportService) {
            var vm = this;
            var mobileView = 992;
            var obj = {};

            vm.data = [];
            $scope.data = [];

            vm.gridImportContacts = {
                multiSelect: true,
                showGridFooter: true,
                enableGridMenu: true,
                enableSorting: false,
                enableColumnMenus: false,
                enableCellEditOnFocus: true,
                data: 'data',
                importerDataAddCallback: function ( grid, newObjects ) {
                    $scope.data = $scope.data.concat( newObjects );
                },
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.rowEdit.on.saveRow($scope, function(rowEntity) {
                        DataService.contact_staging
                        .$add({$priority: rowEntity.Priority,
                            first_name: rowEntity.FirstName,
                            last_name: rowEntity.LastName,
                            business_phone: rowEntity.BusinessPhone,
                            cell_phone: rowEntity.MobilePhone,
                            date_added: firebase.database.ServerValue.TIMESTAMP,
                            view_status: true,
                            email: rowEntity.EmailAddress,
                            company_name: rowEntity.Company,
                            fax: rowEntity.BusinessFax,
                            address1: rowEntity.BusinessStreet,
                            city: rowEntity.BusinessCity,
                            province: rowEntity.BusinessState,
                            postal: rowEntity.BusinessPostalCode,
                            country: rowEntity.BusinessCountry,
                            group: rowEntity.IndustryGroup,
                            job_title: rowEntity.JobTitle
                        });
                    });
                }
            };

            vm.mergeContacts = function() {
                ContactImportService.contacts().once('value').then(function(res) {
                    res.forEach(function(snapShotChild) {
                        ContactImportService.removeStagedContact(snapShotChild.email);
                    });
                });
                ContactImportService.contact_staging().once('value').then(function(res) {
                    res.forEach(function(snapShotChild) {
                        obj = {};
                        obj = snapShotChild;
                        ContactImportService.getCompanyId(obj.company).$loaded().then(function(res) {
                            obj.company_id = res.$id;
                            ContactImportService.addStagedContact(obj);
                        });
                    });
                });
            };
        }

        ImportCompaniesCtrl.$inject = ['$state', '$scope', 'DataService'];

        function ImportCompaniesCtrl($state, $scope, DataService) {
            var vm = this;
            var mobileView = 992;

            vm.data = [];
            $scope.data = [];

            vm.gridImportCompanies = {
                multiSelect: true,
                showGridFooter: true,
                enableGridMenu: true,
                enableSorting: false,
                enableColumnMenus: false,
                enableCellEditOnFocus: true,
                data: 'data',
                importerDataAddCallback: function ( grid, newObjects ) {
                    $scope.data = $scope.data.concat( newObjects );
                },
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.rowEdit.on.saveRow($scope, function(rowEntity) {
                        DataService.contacts
                        .$add({ $priority: rowEntity.Priority,
                            first_name: rowEntity.FirstName,
                            last_name: rowEntity.LastName,
                            business_phone: rowEntity.BusinessPhone,
                            cell_phone: rowEntity.MobilePhone,
                            date_added: firebase.database.ServerValue.TIMESTAMP,
                            view_status: true,
                            email: rowEntity.EmailAddress,
                            company_name: rowEntity.Company,
                            fax: rowEntity.BusinessFax,
                            address1: rowEntity.BusinessStreet,
                            city: rowEntity.BusinessCity,
                            province: rowEntity.BusinessState,
                            postal: rowEntity.BusinessPostalCode,
                            country: rowEntity.BusinessCountry,
                            group: rowEntity.IndustryGroup,
                            job_title: rowEntity.JobTitle })
                        .then(function(contactRef) {
                            DataService.companies
                            .$add({date_added: firebase.database.ServerValue.TIMESTAMP,
                                view_status: true,
                                name: rowEntity.Company,
                                fax: rowEntity.BusinessFax,
                                address1: rowEntity.BusinessStreet,
                                city: rowEntity.BusinessCity,
                                province: rowEntity.BusinessState,
                                postal: rowEntity.BusinessPostalCode,
                                country: rowEntity.BusinessCountry,
                                group: rowEntity.IndustryGroup,
                                primaryContact_id: contactRef.key,
                                address_count: 1})
                                    .then(function(companyRef){
                                        DataService.root.ref('contacts/'+ contactRef.key)
                                            .update({primaryCompany_id: companyRef.key});
                                        DataService.root.ref('contacts/'+ contactRef.key + '/companies/' + companyRef.key)
                                            .set({name: rowEntity.Company, date_added: firebase.database.ServerValue.TIMESTAMP});
                                        DataService.root.ref('companies/'+ companyRef.key + '/contacts/' + contactRef.key)
                                            .set({date_added: firebase.database.ServerValue.TIMESTAMP});
                                        DataService.root.ref('companies/'+ companyRef.key +'/addresses')
                                            .push({priority: 1});
                                    });
                            });
                    });
                }
            };

        }

})();

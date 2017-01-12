(function() {
    'use strict';

     angular
        .module('app.activities')
        .controller('ActivitiesCtrl', ActivitiesCtrl)
        .controller('ActivityCtrl', ActivityCtrl)
        .controller('DiscoveryCtrl', DiscoveryCtrl)
        .controller('ProposalCtrl', ProposalCtrl)
        .controller('QuoteCtrl', QuoteCtrl)
        .controller('OrderCtrl', OrderCtrl)
        .controller('AddCalendarEventCtrl', AddCalendarEventCtrl)

        ActivitiesCtrl.$inject = ['$state', 'ActivitiesService', 'ActivityService', 'AuthService', 'AdminService', 'ProfileService'];

        function ActivitiesCtrl($state, ActivitiesService, ActivityService, AuthService, AdminService, ProfileService) {
            var vm = this;
            vm.uid = {};
            vm.gridType = 'All';
            vm.activityTemplate = 'app/activities/gridTemplates/activityTemplate.html';

            vm.switchGrid = function() {
                if (vm.gridType === 'Mine') {
                    vm.gridType = 'All';
                } else if (vm.gridType === 'All') {
                    vm.gridType = 'Mine';
                };
            };

            vm.uid = AuthService.isLoggedIn().uid;
            AdminService.getUser(vm.uid).$loaded().then(function(res) {
                vm.user = res;

                if (vm.user.type === 'Admin' || vm.user.type === 'Sales Admin') {
                    ActivitiesService.activities(vm.uid).$loaded().then(function(res) {
                        vm.gridAdminActivities.data = res;
                    });

                    ActivitiesService.myActivities(vm.uid).$loaded().then(function(res) {
                        vm.gridAdminMyActivities.data = res;
                    })
                }

                if (vm.user.type === 'Sales') {
                    ActivitiesService.activities(vm.uid).$loaded().then(function(res) {
                        vm.gridActivities.data = res;
                    });

                    ActivitiesService.myActivities(vm.uid).$loaded().then(function(res) {
                        vm.gridMyActivities.data = res;
                    })
                }
            });

            vm.removeActivity = function(row) {
                ActivityService.activity(row.entity.$id).$loaded().then(function(res) {
                    ActivityService.removeActivity(res);
                });
            };

            vm.editActivity = function(row) {
                $state.go('account.activity', {'rowEntity': row.entity});
            };

            vm.selectStep = function(row, step) {
                if (step === 'info')
                    $state.go('account.activity', {'rowEntity': row.entity});
                if (step === 'discovery')
                    $state.go('account.activity.discovery', {'rowEntity': row.entity});
                if (step === 'proposal')
                    $state.go('account.activity.proposal', {'rowEntity': row.entity});
                if (step === 'quote')
                    $state.go('account.activity.quote', {'rowEntity': row.entity});
                if (step === 'order')
                    $state.go('account.activity.order', {'rowEntity': row.entity});
            };

            vm.gridActivities = {
                showGridFooter: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/activities/gridTemplates/editActivity.html',
                        width: 34, enableColumnMenu: false, headerTooltip: 'Edit Activity', enableCellEdit: false, enableFiltering: false },
                    { name:'companyName', field: 'company_name', enableHiding: false, enableCellEdit: false},
                    { name:'contactName', field: 'contact_full_name', enableHiding: false, enableFiltering: false, enableSorting: true, enableCellEdit: false},
                    { name:'InitiatedBy', field: 'user_name', enableHiding: false, enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name:'dateAdded', field: 'info_date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name: 'activityStatus', field: 'info_status_label', cellTemplate: vm.activityTemplate, enableHiding: false, enableCellEdit: false,
                        enableFiltering: false, enableSorting: false, headerTooltip: 'Edit Activity', width: '30%'}]
            };

            vm.gridMyActivities = {
                showGridFooter: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/activities/gridTemplates/editActivity.html',
                        width: 34, enableColumnMenu: false, headerTooltip: 'Edit Activity', enableCellEdit: false, enableFiltering: false },
                    { name:'companyName', field: 'company_name', enableHiding: false, enableCellEdit: false},
                    { name:'contactName', field: 'contact_full_name', enableHiding: false, enableFiltering: false, enableSorting: true, enableCellEdit: false},
                    { name:'InitiatedBy', field: 'user_name', enableHiding: false, enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name:'dateAdded', field: 'info_date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name: 'activityStatus', field: 'info_status_label', cellTemplate: vm.activityTemplate, enableHiding: false, enableCellEdit: false,
                        enableFiltering: false, enableSorting: false, headerTooltip: 'Edit Activity'}]
            };

            vm.gridAdminActivities = {
                showGridFooter: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/activities/gridTemplates/editActivity.html',
                        width: 34, enableColumnMenu: false, headerTooltip: 'Edit Activity', enableCellEdit: false, enableFiltering: false },
                    { name:'companyName', field: 'company_name', enableHiding: false, enableCellEdit: false},
                    { name:'contactName', field: 'contact_full_name', enableHiding: false, enableFiltering: false, enableSorting: true, enableCellEdit: false},
                    { name:'InitiatedBy', field: 'user_name', enableHiding: false, enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name:'dateAdded', field: 'info_date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name: 'activityStatus', field: 'info_status_label', cellTemplate: vm.activityTemplate, enableHiding: false, enableCellEdit: false,
                        enableFiltering: false, enableSorting: false, headerTooltip: 'Edit Activity', width: '30%'},
                    { name: ' ', field: '$id', cellTemplate:'app/activities/gridTemplates/removeActivity.html',
                        width: 35, enableSorting: false, enableFiltering: false, enableCellEdit: false, enableColumnMenu: false }]
            };

            vm.gridAdminMyActivities = {
                showGridFooter: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/activities/gridTemplates/editActivity.html',
                        width: 34, enableColumnMenu: false, headerTooltip: 'Edit Activity', enableCellEdit: false, enableFiltering: false },
                    { name:'companyName', field: 'company_name', enableHiding: false, enableCellEdit: false},
                    { name:'contactName', field: 'contact_full_name', enableHiding: false, enableFiltering: false, enableSorting: true, enableCellEdit: false},
                    { name:'InitiatedBy', field: 'user_name', enableHiding: false, enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name:'dateAdded', field: 'info_date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date', width: '15%' },
                    { name: 'activityStatus', field: 'info_status_label', cellTemplate: vm.activityTemplate, enableHiding: false, enableCellEdit: false,
                        enableFiltering: false, enableSorting: false, headerTooltip: 'Edit Activity'},
                    { name: ' ', field: '$id', cellTemplate:'app/activities/gridTemplates/removeActivity.html',
                        width: 35, enableSorting: false, enableFiltering: false, enableCellEdit: false, enableColumnMenu: false }]
            };

        }

        ActivityCtrl.$inject = ['$state', '$stateParams', '$timeout', '$uibModal', 'ActivityService', 'CustomerSetupService',
            'ContactService', 'CompanyService', 'AuthService', 'AdminService', 'ProfileService'];

        function ActivityCtrl($state, $stateParams, $timeout, $uibModal, ActivityService, CustomerSetupService,
            ContactService, CompanyService, AuthService, AdminService, ProfileService) {
            var vm = this;
            var obj = {};
            vm.uid = {};
            vm.user_profile = {};
            vm.activity = {};
            vm.company = {};
            vm.contact = {};
            vm.activity_contact = {};
            vm.company_count = null;
            vm.contact_id = null;
            vm.contact_label = null;
            vm.add_company = null;
            vm.activity.dt = new Date();
            vm.activity.date = vm.activity.dt.toDateString();
            vm.activity.time = vm.activity.dt.toLocaleTimeString();

            vm.uid = AuthService.isLoggedIn().uid;
            AdminService.getUser(vm.uid).$loaded().then(function(res) {
                ProfileService.loadProfile(res.profile_id).$loaded().then(function(profile){
                    vm.user_profile = profile;
                });
            });

            ActivityService.activityTypes().$loaded().then(function(res) {
                vm.activity_types = res;
            });

            ActivityService.contacts().$loaded().then(function(res) {
                vm.contacts = res;
            });

            CustomerSetupService.industryGroups().$loaded().then(function(res) {
                vm.groups = res;
            });

            CustomerSetupService.regions().$loaded().then(function(res) {
                vm.regions = res;
            });

            ContactService.companies().$loaded().then(function(res) {
                vm.companies = res;
            });

            vm.loadActivity = function(id) {
                ActivityService.activity(id).$loaded().then(function(res) {
                    vm.activity = res;
                    if (vm.activity.info_status === true) {
                        vm.activity.dt = new Date(res.info_date_added);
                        vm.activity.date_added = vm.activity.dt.toDateString();
                        vm.activity.time_added = vm.activity.dt.toLocaleTimeString();
                        vm.activity.dt = new Date(res.info_date_updated);
                        vm.activity.date_updated = vm.activity.dt.toDateString();
                        vm.activity.time_updated = vm.activity.dt.toLocaleTimeString();
                        ContactService.contact(res.contact_id).$loaded().then(function(res) {
                            vm.contact = res;
                            vm.contact_id = res.$id;
                            vm.add_company = false;
                            vm.activity_contact.selected = {full_name: res.full_name};
                            vm.contact_label = res.full_name + ' - ' + res.company_name;
                        });
                    }
                });
            };

            if ($stateParams.rowEntity != null) {
                vm.activity_id = $stateParams.rowEntity.$id;
                vm.loadActivity($stateParams.rowEntity.$id);
            } else {
                vm.activity_id = null;
                vm.contact_id = null;
            }

            vm.addActivity = function() {
                obj = {};
                obj.user_name = vm.user_profile.name;
                obj.uid = vm.uid;
                obj.info_status = true;
                //obj.view_status = true;
                obj.current_status = 'info';
                obj.contact_id = vm.contact_id;
                if (vm.contact.company_name!== undefined)
                    obj.company_name = vm.contact.company_name;
                if (vm.contact.first_name !== undefined && vm.contact.last_name !== undefined)
                    obj.contact_full_name = vm.contact.first_name + ' ' + vm.contact.last_name;
                if (vm.contact.first_name !== undefined && vm.contact.last_name === undefined)
                    obj.contact_full_name = vm.contact.first_name;
                if (vm.activity.activity_type_id !== undefined)
                    obj.activity_type_id = vm.activity.activity_type_id;
                ActivityService.addActivity(obj).then(function(id) {
                    obj.$id = id;
                    obj.contact_id = vm.contact_id;
                    $state.go('account.activity.discovery', {'rowEntity': obj});
                });
            }, function(error) {
                vm.error = error;
            };

            vm.updateActivity = function() {
                obj = {};
                obj.id = vm.activity_id;
                obj.contact_id = vm.contact_id;
                obj.company_name = vm.contact.company_name;
                if (vm.contact.first_name !== undefined && vm.contact.last_name !== undefined)
                    obj.contact_full_name = vm.contact.first_name + ' ' + vm.contact.last_name;
                if (vm.contact.first_name !== undefined && vm.contact.last_name === undefined)
                    obj.contact_full_name = vm.contact.first_name;
                if (vm.activity.activity_type_id !== undefined)
                    obj.activity_type_id = vm.activity.activity_type_id;
                else
                    obj.activity_type_id = null;
                ActivityService.updateActivity(obj);
                $state.go('account.activity.discovery');
            }, function(error) {
                vm.error = error;
            };

            vm.getContact = function() {
                vm.contact_id = vm.contact.$id;
                if (vm.contact.company_name !== undefined) {
                    vm.contact_label = vm.contact.full_name + ' - ' + vm.contact.company_name;
                    vm.add_company = false;
                }
                if (vm.contact.company_name === undefined) {
                    vm.contact_label = vm.contact.full_name;
                    vm.add_company = true;
                }
                if (vm.contact.companies !== undefined)
                    vm.company_count = Object.keys(vm.contact.companies).length;
                else
                    vm.company_count = null;
            }, function(error) {
                vm.error = error;
            };

            vm.updateContact = function() {
                if (vm.contact_id !== null)
                    vm.contact.$save();
            }, function(error) {
                vm.error = error;
            };

            vm.newContact = function() {
                vm.contact.view_status = true;
                if (vm.contact_name.match(' ') === null) {
                    vm.contact.first_name = vm.contact_name;
                    vm.contact.full_name = vm.contact.first_name;
                } else {
                    vm.contact.first_name = vm.contact_name.substr(0, vm.contact_name.indexOf(' '));
                    vm.contact.last_name = vm.contact_name.substr(vm.contact_name.indexOf(' ')+1);
                    vm.contact.full_name = vm.contact.first_name + ' ' + vm.contact.last_name;
                }

                ContactService.addContact(vm.contact).then(function(id) {
                    ContactService.contact(id).$loaded().then(function(res) {
                        vm.contact = res;
                        vm.contact_id = res.$id;
                        vm.activity_contact.selected = {full_name: res.full_name};
                        vm.contact_label = res.full_name;
                        vm.add_company = true;
                    });
                });
            }, function(error) {
                vm.error = error;
            };

            vm.updateCompany = function() {
                obj = {};
                if (vm.contact_id !== null) {
                    obj.contact_id = vm.contact_id;
                    obj.company_id = vm.company.$id;
                    obj.company_name = vm.company.name;
                    obj.uid = AuthService.isLoggedIn().uid;
                    ContactService.updatePrimaryCompany(obj);
                }
            }, function(error) {
                vm.error = error;
            };

            vm.newCompany = function() {
                obj = {};
                vm.company.view_status = true;
                vm.company.address_count = 1;
                vm.company.name = vm.company_name;
                CompanyService.newCompany(vm.company).then(function(key) {
                    obj.company_id = key;
                    obj.id = key;
                    obj.cnt = 1;
                    obj.contact_id = vm.contact_id;
                    obj.company_name = vm.company.name;
                    obj.uid = AuthService.isLoggedIn().uid;
                    CompanyService.addAddress(obj);
                    ContactService.updatePrimaryCompany(obj);
                });
            }, function(error) {
                vm.error = error;
            };

            vm.addCalendarEvent = function (jsEvent) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'AddCalendarEventCtrl',
                    resolve: {
                        activity_id: function () {
                            return vm.activity_id;
                        },
                        profile_id: function () {
                            return vm.user_profile_id;
                        }
                    }
                });
            };

        }

        DiscoveryCtrl.$inject = ['$state', '$scope', '$stateParams', '$timeout', '$uibModal', 'ActivityService', 'CustomerSetupService', 'ActivitySetupService',
            'ContactService', 'ContactLoadPreferences', 'ContactLoadKpis'];

        function DiscoveryCtrl($state, $scope, $stateParams, $timeout, $uibModal, ActivityService, CustomerSetupService, ActivitySetupService,
            ContactService, ContactLoadPreferences, ContactLoadKpis) {
            var vm = this;
            var obj = {};
            var cnt = {};
            vm.activity = {};
            vm.discovery = {};
            vm.contact_preference = {};
            vm.contact_kpi = {};
            vm.discovery.dt = new Date();
            vm.discovery.date = vm.discovery.dt.toDateString();
            vm.discovery.time = vm.discovery.dt.toLocaleTimeString();

            $scope.preferences = {
                selected: null,
                lists: {"P": []}
            };

            $scope.kpis = {
                selected: null,
                lists: {"K": []}
            };

            ActivitySetupService.businessQuestions().$loaded().then(function(res) {
                vm.business_questions = res;
            });

            ActivitySetupService.solutionQuestions().$loaded().then(function(res) {
                vm.solution_questions = res;
            });

            vm.loadPreferences = function(id) {
                ContactLoadPreferences.initiate(id);
                ContactService.contactPreferences(vm.contact_id).$loaded().then(function(res) {
                    vm.contact_preference = res[0];
                    $scope.preferences.lists.P = res;
                });
            };

            vm.loadKpis = function(id) {
                ContactLoadKpis.initiate(id);
                ContactService.contactKpis(vm.contact_id).$loaded().then(function(res) {
                    vm.contact_kpi = res[0];
                    $scope.kpis.lists.K = res;
                });
            };

            vm.loadActivity = function (id) {
                ActivityService.activity(id).$loaded().then(function(res) {
                    vm.activity = res;
                    if (vm.activity.discovery_status === true) {
                        vm.discovery.dt = new Date(res.discovery_date_added);
                        vm.discovery.date_added = vm.discovery.dt.toDateString();
                        vm.discovery.time_added = vm.discovery.dt.toLocaleTimeString();
                        vm.discovery.dt = new Date(res.discovery_date_updated);
                        vm.discovery.date_updated = vm.discovery.dt.toDateString();
                        vm.discovery.time_updated = vm.discovery.dt.toLocaleTimeString();
                    }
                    vm.contact_id = res.contact_id;
                    ContactService.contact(vm.contact_id).$loaded().then(function(res) {
                        vm.contact = res;
                    });
                    vm.loadPreferences(vm.contact_id);
                    vm.loadKpis(vm.contact_id);
                });
            };

            if (vm.activity.current_status === 'info') {
                vm.discovery_id = null;
                ContactService.contact(res.contact_id).$loaded().then(function(res) {
                    vm.contact = res;
                    vm.contact_id = res.$id;
                    if (vm.contact.companies != undefined)
                        vm.company_count = Object.keys(vm.contact.companies).length;
                });
            };

            if ($stateParams.rowEntity != null) {
                vm.activity_id = $stateParams.rowEntity.$id;
                vm.loadActivity(vm.activity_id);
            } else {
                vm.activity_id = null;
                vm.discovery_id = null;
            }

            vm.loadContactCompanies = function(id){
                vm.contact_companies = [];
                ContactService.contactCompanies(id).$loaded().then(function(res) {
                    for(var i = 0; i < res.length; i++) {
                        var theRef = res[i];
                        CompanyService.company(theRef.$id).$loaded().then(function(theCompany){
                                theCompany.date_added = theRef.date_added;
                                vm.contact_companies.push(theCompany);
                        });
                    };
                });
            };

            vm.updateContact = function() {
                if (vm.contact_id !== null)
                    vm.contact.$save();
            }, function(error) {
                vm.error = error;
            };

            vm.updateDiscoveryDate = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.updateDiscovery(obj);
            }, function(error) {
                vm.error = error;
            };

            vm.updateDiscovery = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.updateDiscovery(obj);
                $state.go('account.activity.proposal');
            }, function(error) {
                vm.error = error;
            };

            vm.removeStatus = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.removeStatus(obj);
                $state.go('account.activity');
            }, function(error) {
                vm.error = error;
            };

            vm.updatePreferenceNote = function(key, label) {
                obj = {};
                obj.key = key;
                obj.contact_id = vm.contact_id;
                obj.notes = vm.contact_preference.notes
                ContactService.contactUpdatePreferenceNote(obj);
                vm.updateDiscoveryDate();
            };

            vm.selectPreference = function() {
                obj = {};
                obj.contact_id = vm.contact_id;
                obj.key = $scope.preferences.selected.$id;
                ContactService.contactPreference(obj).$loaded().then(function(res) {
                    vm.contact_preference = res;
                });
                vm.updateDiscoveryDate();
            };

            vm.preferenceRanking = function($index, key, event) {
                obj = {};
                var cnt = 1;
                var data = $scope.preferences.lists.P;
                for(var i = 0; i < data.length; i++) {
                    obj.key = data[i].$id;
                    obj.cnt = cnt;
                    obj.contact_id = vm.contact_id;
                    ContactService.contactUpdatePreferencePriority(obj);
                    cnt = cnt + 1;
                }
                vm.updateDiscoveryDate();
            };

            vm.updateKpiNote = function(key, label) {
                obj = {};
                obj.key = key;
                obj.contact_id = vm.contact_id;
                obj.notes = vm.contact_kpi.notes
                ContactService.contactUpdateKpiNote(obj);
                vm.updateDiscoveryDate();
            };

            vm.selectKpi = function() {
                obj = {};
                obj.contact_id = vm.contact_id;
                obj.key = $scope.kpis.selected.$id;
                ContactService.contactKpi(obj).$loaded().then(function(res) {
                    vm.contact_kpi = res;
                });
                vm.updateDiscoveryDate();
            };

            vm.kpiRanking = function($index, key, event) {
                obj = {};
                var cnt = 1;
                var data = $scope.kpis.lists.K;
                for(var i = 0; i < data.length; i++) {
                    obj.key = data[i].$id;
                    obj.cnt = cnt;
                    obj.contact_id = vm.contact_id;
                    ContactService.contactUpdateKpiPriority(obj);
                    cnt = cnt + 1;
                }
                vm.updateDiscoveryDate();
            };

            vm.updateBusinessAnswer = function(name) {
                obj = {};
                obj.id = vm.contact_id;
                obj.name = name;
                var dt = new Date();
                obj.date = dt.toDateString();
                obj.time = dt.toLocaleTimeString();
                if (name === 'question1') obj.answer = vm.contact.business_answers.question1.answer;
                if (name === 'question2') obj.answer = vm.contact.business_answers.question2.answer;
                if (name === 'question3') obj.answer = vm.contact.business_answers.question3.answer;
                if (name === 'question4') obj.answer = vm.contact.business_answers.question4.answer;
                if (name === 'question5') obj.answer = vm.contact.business_answers.question5.answer;
                if (name === 'question6') obj.answer = vm.contact.business_answers.question6.answer;
                if (name === 'question7') obj.answer = vm.contact.business_answers.question7.answer;
                if (name === 'question8') obj.answer = vm.contact.business_answers.question8.answer;
                if (name === 'question9') obj.answer = vm.contact.business_answers.question9.answer;
                ActivityService.updateBusinessAnswer(obj);
                vm.updateDiscoveryDate();
            }, function(error) {
                vm.error = error;
            };

            vm.updateSolutionAnswer = function(name) {
                obj = {};
                obj.id = vm.contact_id;
                obj.name = name;
                var dt = new Date();
                obj.date = dt.toDateString();
                obj.time = dt.toLocaleTimeString();
                if (name === 'question1') obj.answer = vm.contact.solution_answers.question1.answer;
                if (name === 'question2') obj.answer = vm.contact.solution_answers.question2.answer;
                if (name === 'question3') obj.answer = vm.contact.solution_answers.question3.answer;
                if (name === 'question4') obj.answer = vm.contact.solution_answers.question4.answer;
                if (name === 'question5') obj.answer = vm.contact.solution_answers.question5.answer;
                if (name === 'question6') obj.answer = vm.contact.solution_answers.question6.answer;
                if (name === 'question7') obj.answer = vm.contact.solution_answers.question7.answer;
                if (name === 'question8') obj.answer = vm.contact.solution_answers.question8.answer;
                if (name === 'question9') obj.answer = vm.contact.solution_answers.question9.answer;
                ActivityService.updateSolutionAnswer(obj);
                vm.updateDiscoveryDate();
            }, function(error) {
                vm.error = error;
            };

            vm.addCalendarEvent = function (jsEvent) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'AddCalendarEventCtrl',
                    resolve: {
                        activity_id: function () {
                            return vm.activity_id;
                        },
                        profile_id: function () {
                            return vm.user_profile_id;
                        }
                    }
                });
            };

        }

        ProposalCtrl.$inject = ['$state', '$stateParams', '$uibModal', 'ActivityService', 'ContactService'];

        function ProposalCtrl($state, $stateParams, $uibModal, ActivityService, ContactService) {
            var vm = this;
            var obj = {};
            var storageRef = firebase.storage().ref();
            vm.activity = {};
            vm.proposal = {};
            vm.proposal.dt = new Date();
            vm.proposal.date = vm.proposal.dt.toDateString();
            vm.proposal.time = vm.proposal.dt.toLocaleTimeString();

            vm.loadActivity = function (id) {
                ActivityService.activity(id).$loaded().then(function(res) {
                    vm.activity = res;
                    if (vm.activity.proposal_status === true) {
                        vm.proposal.dt = new Date(res.discovery_date_added);
                        vm.proposal.date_added = vm.proposal.dt.toDateString();
                        vm.proposal.time_added = vm.proposal.dt.toLocaleTimeString();
                        vm.proposal.dt = new Date(res.discovery_date_updated);
                        vm.proposal.date_updated = vm.proposal.dt.toDateString();
                        vm.proposal.time_updated = vm.proposal.dt.toLocaleTimeString();
                    }
                    vm.contact_id = res.contact_id;
                    ContactService.contact(vm.contact_id).$loaded().then(function(res) {
                        vm.contact = res;
                    });
                    obj.contact_id = vm.contact_id;
                    obj.activity_id = vm.activity_id;
                    ActivityService.activityDocs(obj).$loaded().then(function(res) {
                        vm.docs = res;
                    });
                });
            };

            if ($stateParams.rowEntity != null) {
                vm.activity_id = $stateParams.rowEntity.$id;
                vm.loadActivity($stateParams.rowEntity.$id);
            } else {
                vm.activity_id = null;
                vm.proposal_id = null;
            }

            vm.updateProposal = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.updateProposal(obj);
                $state.go('account.activity.quote');
            }, function(error) {
                vm.error = error;
            };

            vm.removeStatus = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.removeStatus(obj);
                $state.go('account.activity.discovery');
            }, function(error) {
                vm.error = error;
            };

            vm.uploadFiles = function(files) {
                angular.forEach(files, function(file) {
                    obj = {};
                    var metadata = {
                        'contentType': file.type
                    };
                    if (metadata.contentType === 'image/jpeg') obj.icon = 'fa-file-image-o';
                    if (metadata.contentType === 'image/gif') obj.icon = 'fa-file-image-o';
                    if (metadata.contentType === 'image/png') obj.icon = 'fa-file-image-o';
                    if (metadata.contentType === 'video/quicktime') obj.icon = 'fa-file-video-o';
                    if (metadata.contentType === 'application/zip') obj.icon = 'fa-file-zip-o';
                    if (metadata.contentType === 'application/pdf') obj.icon = 'fa-file-pdf-o';
                    if (metadata.contentType === 'application/msword') obj.icon = 'fa-file-word-o';
                    if (metadata.contentType === 'application/excel') obj.icon = 'fa-file-excel-o';
                    if (metadata.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') obj.icon = 'fa-file-word-o';
                    if (metadata.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') obj.icon = 'fa-file-excel-o';
                    var node = 'contacts/'+vm.contact_id+'/';
                    var uploadTask = storageRef.child(node + file.name).put(file, metadata);
                    uploadTask.on('state_changed', null, function(error) {
                        vm.error = error;
                    }, function() {
                        obj.contact_id = vm.contact_id;
                        obj.activity_id = vm.activity_id;
                        //obj.view_status = true;
                        obj.total_bytes = uploadTask.snapshot.totalBytes;
                        obj.content_type = uploadTask.snapshot.metadata.contentType;
                        obj.name = uploadTask.snapshot.metadata.name;
                        obj.url = uploadTask.snapshot.metadata.downloadURLs[0];
                        ContactService.addDoc(obj);
                    });
                });
            }

            vm.addCalendarEvent = function (jsEvent) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'AddCalendarEventCtrl',
                    resolve: {
                        activity_id: function () {
                            return vm.activity_id;
                        },
                        profile_id: function () {
                            return vm.user_profile_id;
                        }
                    }
                });
            };

            vm.removeDoc = function(id) {
                obj = {};
                obj.contact_id = vm.contact_id;
                obj.doc_id = id;
                ContactService.removeDoc(obj);
            }

        }

        QuoteCtrl.$inject = ['$state', '$q', '$scope', '$stateParams', '$uibModal', 'ActivityService', 'ContactService', 'TemplateService',
            'PriceListService', 'AuthService', 'ProfileService', 'AdminService'];

        function QuoteCtrl($state, $q, $scope, $stateParams, $uibModal, ActivityService, ContactService, TemplateService,
            PriceListService, AuthService, ProfileService, AdminService) {
            var vm = this;
            var obj = {};
            vm.quote_template = {};
            vm.template_images = {};
            vm.contact = {};
            vm.user_profile = {};
            vm.price_list = [];
            vm.category = {};
            vm.chosen_rates = [];
            vm.services = [];
            vm.transportation = [];
            vm.quote = {};
            vm.quote.dt = new Date();
            vm.quote.date = vm.quote.dt.toDateString();
            vm.quote.time = vm.quote.dt.toLocaleTimeString();
            vm.categories = [{name: "DIESEL GENERATOR"}, {name: "LIGHT TOWER"}, {name: "NAT GAS GENERATOR"},
                {name: "FUEL TANK"}, {name: "PROPANE TANK"}, {name: "POWER DISTRIBUTION CENTER"},
                {name: "TRANSFER SWITCH/TRANSFORMERS"}, {name: "LOAD BANK"}, {name: "CABLES"},
                {name: "FUEL LINES"}, {name: "GROUND RODS"}, {name: "ENGINES"}, {name: "LIGHT TOWER"}];

            TemplateService.template_images().$loaded().then(function(res) {
                vm.template_images = res;
            });

            TemplateService.quote().$loaded().then(function(res) {
                vm.quote_template = res;
            });

            TemplateService.ratesByShift().$loaded().then(function(res) {
                vm.ratesByShift = res;
            });

            vm.loadPrices = function() {
                PriceListService.categoryPrices(vm.category).$loaded().then(function(res) {
                    vm.price_list = res;
                });
            };

            vm.servicesSetup = function(id) {
                TemplateService.services().$loaded().then(function(res) {
                    vm.services = res;
                    for (var i = 0; i < vm.services.length; i++){
                        obj = {};
                        obj = vm.services[i];
                        obj.service_id = vm.services[i].$id;
                        obj.id = id;
                        ActivityService.setService(obj);
                        vm.loadActivity(id);
                    };
                });
            };

            vm.transportationSetup = function(id) {
                TemplateService.transportation().$loaded().then(function(res) {
                    vm.transportation = res;
                    for (var i = 0; i < vm.transportation.length; i++){
                        obj = {};
                        obj = vm.transportation[i];
                        obj.transportation_id = vm.transportation[i].$id;
                        obj.id = id;
                        ActivityService.setTransportation(obj);
                        vm.loadActivity(id);
                    };
                });
            };

            vm.loadActivity = function (id) {
                ActivityService.activity(id).$loaded().then(function(res) {
                    vm.activity = res;
                    if (vm.activity.services == undefined) {
                        vm.servicesSetup(id);
                    } else {
                        ActivityService.services(id).$loaded().then(function(res) {
                            vm.services = res;
                            vm.gridServices.data = res;
                        });
                    };
                    if (vm.activity.transportation == undefined) {
                        vm.transportationSetup(id);
                    } else {
                        ActivityService.transportation(id).$loaded().then(function(res) {
                            vm.transportation = res;
                            vm.gridTransportation.data = res;
                        });
                    };
                    if (vm.activity.quote_status === true) {
                        vm.quote.dt = new Date(res.proposal_date_added);
                        vm.quote.date_added = vm.quote.dt.toDateString();
                        vm.quote.time_added = vm.quote.dt.toLocaleTimeString();
                        vm.quote.dt = new Date(res.proposal_date_updated);
                        vm.quote.date_updated = vm.quote.dt.toDateString();
                        vm.quote.time_updated = vm.quote.dt.toLocaleTimeString();
                    };
                    vm.contact_id = res.contact_id;
                    ContactService.contact(vm.contact_id).$loaded().then(function(res) {
                        vm.contact = res;
                    });
                    ActivityService.activityRates(id).$loaded().then(function(res) {
                        vm.chosen_rates = res;
                    });
                    AdminService.getUser(vm.activity.uid).$loaded().then(function(res) {
                        ProfileService.loadProfile(res.profile_id).$loaded().then(function(profile) {
                            vm.user_profile = profile;
                        });
                    });
                });
            };

            if ($stateParams.rowEntity != null) {
                vm.activity_id = $stateParams.rowEntity.$id;
                vm.loadActivity($stateParams.rowEntity.$id);
            } else {
                vm.activity_id = null;
                vm.proposal_id = null;
            };

            vm.addCalendarEvent = function (jsEvent) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'AddCalendarEventCtrl',
                    resolve: {
                        activity_id: function () {
                            return vm.activity_id;
                        },
                        profile_id: function () {
                            return vm.user_profile_id;
                        }
                    }
                });
            };

            vm.addRate = function() {
                obj = {};
                obj.rate_id = vm.price.$id;
                obj.id = vm.activity_id;
                obj.name = vm.price.name;
                obj.four_week_rate = vm.price.four_week_rate;
                obj.week_rate = vm.price.week_rate;
                obj.day_rate = vm.price.day_rate;
                obj.description = vm.price.description;
                obj.power_output = vm.price.power_output;
                ActivityService.addRate(obj);
                vm.price = null;
                vm.category = null;
            };

            vm.removeRate = function(rate) {
                obj = {};
                obj.id = vm.activity_id;
                obj.rate_id = rate.$id;
                ActivityService.removeRate(obj);
            };

            vm.addActivityNode = function(node) {
                if (node === 'service') {
                    obj = {};
                    obj.node = node;
                    obj.id = vm.activity_id;
                    obj.service = vm.new_service;
                    vm.new_service = null;
                    ActivityService.addActivityNode(obj);
                };
                if (node === 'transportation') {
                    obj = {};
                    obj.node = node;
                    obj.id = vm.activity_id;
                    obj.transportation = vm.new_transportation;
                    vm.new_transportation = null;
                    ActivityService.addActivityNode(obj);
                };
            }, function(error) {
                vm.error = error;
            };

            vm.removeActivityNode = function(row, node) {
                obj = {};
                obj.id = vm.activity_id;
                obj.node_id = row.entity.$id;
                obj.node = node;
                ActivityService.removeActivityNode(obj);
            }, function(error) {
                vm.error = error;
            };

            vm.updateOrderType = function() {
                obj = {};
                obj.id = vm.activity_id;
                obj.order_type = vm.activity.order_type;
                ActivityService.updateOrderType(obj);
                vm.loadActivity(vm.activity_id);
            };

            vm.updateRate = function(rate) {
                obj = {};
                obj = rate;
                obj.id = vm.activity_id;
                obj.rate_id = rate.$id;
                ActivityService.updateRate(obj);
            };

            vm.updateQuote = function() {
                if (vm.activity.order_type != undefined) {
                    obj = {};
                    obj.id = vm.activity_id;
                    obj.current_status = vm.activity.current_status;
                    ActivityService.updateQuote(obj);
                    vm.loadActivity(vm.activity_id);
                } else {
                    console.log('Please Choose An Order Type')
                };
            }, function(error) {
                vm.error = error;
            };

            vm.removeStatus = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.removeStatus(obj);
                $state.go('account.activity.proposal');
            }, function(error) {
                vm.error = error;
            };

            vm.saveActivityService = function(obj) {
                obj.id = vm.activity_id;
                var promise = $q.defer();
                $scope.gridServicesApi.rowEdit.setSavePromise( obj, promise.promise );
                ActivityService.updateActivityService(obj);
                promise.resolve();
            }, function(error) {
                vm.error = error;
            };

            vm.saveActivityTransportation = function(obj) {
                obj.id = vm.activity_id;
                var promise = $q.defer();
                $scope.gridTransportationApi.rowEdit.setSavePromise( obj, promise.promise );
                ActivityService.updateActivityTransportation(obj);
                promise.resolve();
            }, function(error) {
                vm.error = error;
            };

            vm.gridServices = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'services', field: 'service', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/activities/gridTemplates/removeService.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridServices.onRegisterApi = function(gridServicesApi) {
                $scope.gridServicesApi = gridServicesApi;
                gridServicesApi.rowEdit.on.saveRow($scope, vm.saveActivityService);
            };

            vm.gridTransportation = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'transportation', field: 'transportation', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/activities/gridTemplates/removeTransportation.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridTransportation.onRegisterApi = function(gridTransportationApi) {
                $scope.gridTransportationApi = gridTransportationApi;
                gridTransportationApi.rowEdit.on.saveRow($scope, vm.saveActivityTransportation);
            };

            vm.next = function() {
                $state.go('account.activity.order')
            };

            vm.createQuoteDefinition = function() {
                obj = {}
                if (vm.contact !== undefined) {
                    obj.order_type = vm.activity.order_type;
                    if (vm.contact.company_name !== undefined)
                        obj.company_name = vm.contact.company_name

                    if (vm.contact.city !== undefined)
                        obj.city_province = vm.contact.city;
                    else
                        obj.city_province = "";

                    if (vm.contact.province !== undefined)
                        obj.city_province = obj.city_province + ', ' + vm.contact.province;
                    else
                        obj.city_province = "";

                    if (vm.contact.first_name !== undefined)
                        obj.attention = 'Attention: ' + vm.contact.first_name;

                    if (vm.contact.last_name !== undefined)
                        obj.attention = ' ' + vm.contact.last_name

                    if (vm.contact.job_title !== undefined)
                        obj.attention = obj.attention + ' | ' + vm.contact.job_title;

                    if (vm.contact.business_phone !== undefined) {
                        obj.phone = 'Business Phone: ' + vm.contact.business_phone;
                        if (vm.contact.cell_phone !== undefined)
                            obj.phone = obj.phone + ' Cell Phone: ' + vm.contact.cell_phone;
                        else
                            obj.phone = "";
                    } else {
                        obj.phone = "";
                    }


                    if (vm.contact.address1 !== undefined)
                        obj.address = vm.contact.address1;
                    else
                        obj.address = "";

                    if (vm.contact.address2 !== undefined)
                        obj.address = obj.address + '\n' + vm.contact.address2;
                    else
                        obj.address = "";

                    if (vm.contact.postal === undefined) {
                        obj.postal = "";
                        if (vm.contact.postal_code !== undefined)
                            obj.postal = vm.contact.postal_code;
                        else
                            obj.postal = "";
                    } else {
                        obj.postal = vm.contact.postal;
                    }
                }

                if (vm.template_images !== undefined) {
                    if (vm.template_images.header_image !== undefined)
                        obj.header_image = vm.template_images.header_image.base64;

                    if (vm.template_images.footer_image !== undefined)
                        obj.footer_image = vm.template_images.footer_image.base64;
                }

                if (vm.user_profile !== undefined) {
                    if (vm.user_profile.signature_image !== undefined)
                        obj.signature_image = vm.user_profile.signature_image.base64;
                    else
                        obj.signature_image = vm.template_images.signature_image.base64;



                    if (vm.user_profile.signature_statement !== undefined) {
                        obj.profile_closing = vm.user_profile.signature_statement;
                        obj.first_name = "";
                        obj.last_name = "";
                    } else {
                        if (vm.user_profile.first_name !== undefined)
                            obj.first_name = vm.user_profile.first_name;

                        if (vm.user_profile.last_name !== undefined)
                            obj.last_name = vm.user_profile.last_name;
                        obj.profile_closing = "";
                    }
                }

                if (vm.quote_template !== undefined) {
                    if (vm.quote_template.subject_line !== undefined)
                        obj.subject_line = vm.quote_template.subject_line;

                    if (vm.quote_template.preamble !== undefined)
                        obj.preamble = vm.quote_template.preamble;

                    if (vm.quote_template.closing_statement !== undefined)
                        obj.closing = vm.quote_template.closing_statement;
                    else
                        obj.closing = "";
                }

                if (vm.chosen_rates.length === 0)
                    obj.chosen_rates = [];
                else
                    obj.chosen_rates = vm.chosen_rates;

                if (vm.ratesByShift.length === 0)
                    obj.ratesByShift = [];
                else
                    obj.ratesByShift = vm.ratesByShift;

                if (vm.services.length === 0)
                    obj.services = null;
                else
                    obj.services = vm.services;

                if (vm.transportation.length === 0)
                    obj.transportation = null;
                else
                    obj.transportation = vm.transportation;

                var rateBody = [];
                if (obj.order_type != 'Daily Rate') {
                    var cols = [100, 205, '*', '*', '*'];
                    rateBody.push([{ text: 'Rental Rates', colSpan: 5, alignment: 'center'}, {}, {}, {}, {}]);
                    rateBody.push([{ text: 'Name', alignment: 'left' }, { text: 'Description', alignment: 'left' }, { text: '4 Week Rate', alignment: 'right' }, { text: 'Weekly Rate', alignment: 'right' }, { text: 'Day Rate', alignment: 'right' }]);
                    for (var i = 0; i < obj.chosen_rates.length; i++) {
                        rateBody.push([
                            obj.chosen_rates[i].name,
                            obj.chosen_rates[i].description,
                            {text: obj.chosen_rates[i].four_week_rate.toFixed(2), alignment: 'right'},
                            {text: obj.chosen_rates[i].week_rate.toFixed(2), alignment: 'right'},
                            {text: obj.chosen_rates[i].day_rate.toFixed(2), alignment: 'right'},
                        ]);
                    };
                } else {
                    var cols = [175, 225, '*'];
                    rateBody.push([{ text: 'Rental Rates', colSpan: 3, alignment: 'center'}, {}, {}]);
                    rateBody.push([{ text: 'Name', alignment: 'left' }, { text: 'Description', alignment: 'left' }, { text: 'Day Rate', alignment: 'right' }]);
                    for (var i = 0; i < obj.chosen_rates.length; i++) {
                        rateBody.push([
                            obj.chosen_rates[i].name,
                            obj.chosen_rates[i].description,
                            {text: obj.chosen_rates[i].day_rate.toFixed(2), alignment: 'right'},
                        ]);
                    };

                }

                var shiftBody = [];
                if (obj.order_type != 'Daily Rate') {
                    var shiftStyle = 'table';
                    var shiftCols = [80, 320, '*'];
                    shiftBody.push([{ text: 'Rates By Shift', colSpan: 3, alignment: 'center'}, {}, {}]);
                    shiftBody.push([{ text: 'Shift', alignment: 'left' }, { text: 'Runtime', alignment: 'left' }, { text: '% of Cost', alignment: 'right' }]);
                    for (var i = 0; i < obj.ratesByShift.length; i++) {
                        shiftBody.push([
                            obj.ratesByShift[i].label,
                            obj.ratesByShift[i].runtime,
                            {text: obj.ratesByShift[i].percent_of_cost, alignment: 'right'},
                        ]);
                    };
                } else {
                    var shiftStyle = 'noTable';
                    var shiftLayout = 'noBorders';
                    var shiftCols = ['*', '*', '*'];
                    shiftBody = [{},{},{}],[{},{},{}];
                };

                var servicesBody = [];
                for (var i = 0; i < obj.services.length; i++) {
                    servicesBody.push([
                        obj.services[i].service,
                    ]);
                };

                var transportationBody = [];
                for (var i = 0; i < obj.transportation.length; i++) {
                    transportationBody.push([
                        obj.transportation[i].transportation,
                    ]);
                };
console.log(obj)
                if (obj.order_type !== 'Daily Rate') {
                    var pdf = {
                        pageMargins: [40, 80, 40, 65],

                        header: {
                            margin: [0, 20],
                            image: obj.header_image,  width: 595, height: 60
                        },

                        footer: {
                            image: obj.footer_image,  width: 598, height: 60
                        },
                        content: [
                            {
                                fontSize: 10,
                                margin: [0, 20],
                                text: [
                                    { text: obj.company_name, bold: true }, '\n',
                                    obj.address, '\n',
                                    obj.city_province, '\n',
                                    obj.postal, '\n\n',
                                    obj.attention, '\n',
                                    obj.phone, '\n\n',
                                    { text: obj.subject_line, bold: true }, '\n\n',
                                    obj.preamble, '\n',
                                ]
                            },
                            {
                                style: 'table',
                                table: {
                                    headerRows: 2,
                                    widths: cols,
                                    body: rateBody,
                                }
                            },
                            '\n',
                            {
                                style: shiftStyle,
                                table: {
                                    headerRows: 2,
                                    widths: shiftCols,
                                    body: shiftBody,
                                },
                                layout: shiftLayout,
                            },
                            '\n',
                            { text: 'Additional Information', bold: true, fontSize: 10 }, '\n',
                            {
                                fontSize: 10,
                                margin: [20, 0, 0, 0],
                                ul: [
                                    'Services',
                                    {
                                        margin: [10, 0, 0, 0],
                                        ul: servicesBody,

                                    },
                                    'Transportation',
                                    {
                                        margin: [10, 0, 0, 0],
                                        ul: transportationBody,
                                    },
                                ]

                            },
                            '\n',
                            {
                                fontSize: 10,
                                text: [
                                    obj.closing, '\n',
                                    obj.profile_closing, '\n\n',
                                ]
                            },
                            {
                                image: obj.signature_image,  width: 60, height: 20
                            },

                            {
                                fontSize: 10,
                                text: [
                                    obj.first_name, ' ',
                                    obj.last_name, '\n',
                                ]
                            },
                        ],
                    };
                } else {
                    var pdf = {
                        pageMargins: [40, 80, 40, 65],

                        header: {
                            margin: [0, 20],
                            image: obj.header_image,  width: 595, height: 60
                        },

                        footer: {
                            image: obj.footer_image,  width: 598, height: 60
                        },

                        content: [
                            {
                                fontSize: 10,
                                margin: [0, 20],
                                text: [
                                    { text: obj.company_name, bold: true }, '\n',
                                    obj.address, '\n',
                                    obj.city_province, '\n',
                                    obj.postal, '\n\n',
                                    obj.attention, '\n',
                                    obj.phone, '\n\n',
                                    { text: obj.subject_line, bold: true }, '\n\n',
                                    obj.preamble, '\n',
                                ]
                            },
                            {
                                style: 'table',
                                table: {
                                    headerRows: 2,
                                    widths: cols,
                                    body: rateBody,
                                }
                            },
                            { text: 'Additional Information', bold: true, fontSize: 10 }, '\n',
                            {
                                fontSize: 10,
                                margin: [20, 0, 0, 0],
                                ul: [
                                    'Services',
                                    {
                                        margin: [10, 0, 0, 0],
                                        ul: servicesBody,

                                    },
                                    'Transportation',
                                    {
                                        margin: [10, 0, 0, 0],
                                        ul: transportationBody,
                                    },
                                ]

                            },
                            '\n',
                            {
                                fontSize: 10,
                                text: [
                                    obj.closing, '\n',
                                    obj.profile_closing, '\n\n',
                                ]
                            },
                            {
                                image: obj.signature_image,  width: 60, height: 20
                            },

                            {
                                fontSize: 10,
                                text: [
                                    obj.first_name, ' ',
                                    obj.last_name, '\n',
                                ]
                            },
                        ],
                    };

                }
                pdfMake.createPdf(pdf).open();
            };

            vm.createQuotePdf = function() {
                vm.createQuoteDefinition();
            };

        }

        OrderCtrl.$inject = ['$scope', '$state', '$stateParams', '$uibModal', 'ActivityService', 'ContactService', 'TemplateService',
            'PriceListService', 'AuthService', 'ProfileService', 'AdminService'];

        function OrderCtrl($scope, $state, $stateParams, $uibModal, ActivityService, ContactService, TemplateService,
                PriceListService, AuthService, ProfileService, AdminService) {
            var vm = this;
            var obj = {};
            vm.order_template = {};
            vm.quote_template = {};
            vm.template_images = {};
            vm.contact = {};
            vm.user_profile = {};
            vm.chosen_rates = [];
            vm.order = {};
            vm.order.dt = new Date();
            vm.order_date = vm.order.dt.toDateString();
            vm.order_time = vm.order.dt.toLocaleTimeString();

            $scope.dateOptions = {
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };

            $scope.popup1 = {
                opened: false
            };

            TemplateService.template_images().$loaded().then(function(res){
                vm.template_images = res;
            });

            TemplateService.quote().$loaded().then(function(res){
                vm.quote_template = res;
            });

            TemplateService.order().$loaded().then(function(res){
                vm.order_template = res;
            });

            TemplateService.ratesByShift().$loaded().then(function(res){
                vm.ratesByShift = res;
            });

            vm.loadActivity = function (id) {
                ActivityService.activity(id).$loaded().then(function(res) {
                    vm.activity = res;
                    if (vm.activity.order_status === true) {
                        vm.order.dt = new Date(res.quote_date_added);
                        vm.order_date_added = vm.order.dt.toDateString();
                        vm.order_time_added = vm.order.dt.toLocaleTimeString();
                        vm.order.dt = new Date(res.quote_date_updated);
                        vm.order_date_updated = vm.order.dt.toDateString();
                        vm.order_time_updated = vm.order.dt.toLocaleTimeString();
                    }
                    vm.contact_id = res.contact_id;
                    ContactService.contact(vm.contact_id).$loaded().then(function(res) {
                        vm.contact = res;
                    });
                    ActivityService.activityRates(id).$loaded().then(function(res) {
                        vm.chosen_rates = res;
                    });

                    ActivityService.order(id).$loaded().then(function(res){
                        vm.order = res;
                        vm.order.delivery_date = new Date(res.delivery_date);
                        vm.order.rental_start_date = new Date(res.rental_start_date);
                        vm.order.rental_end_date = new Date(res.rental_end_date);
                    });
                    AdminService.getUser(vm.activity.uid).$loaded().then(function(res) {
                        ProfileService.loadProfile(res.profile_id).$loaded().then(function(profile){
                            vm.user_profile = profile;
                        });
                    });
                });
            };

            if ($stateParams.rowEntity != null) {
                vm.activity_id = $stateParams.rowEntity.$id;
                vm.loadActivity($stateParams.rowEntity.$id);
            } else {
                vm.activity_id = null;
                vm.order_id = null;
            };

            vm.updateUnitNo = function(id, unit_no) {
                obj = {};
                obj.id = vm.activity_id;
                obj.rate_id = id;
                obj.unit_no = unit_no;
                ActivityService.updateUnitNo(obj);
            }

            vm.updateOrder = function() {
                obj = {};
                obj = vm.order;
                if (obj.on_site_contact === undefined)
                    obj.on_site_contact = null;
                if (obj.on_site_contact_number === undefined)
                    obj.on_site_contact_number = null;
                if (obj.location === undefined)
                    obj.location = null;
                if (obj.lsd_number === undefined)
                    obj.lsd_number = null;
                if (obj.po_number === undefined)
                    obj.po_number = null;
                if (obj.application === undefined)
                    obj.application = null;
                if (obj.rig_number === undefined)
                    obj.rig_number = null;
                if (obj.reason_for_product === undefined)
                    obj.reason_for_product = null;
                if (obj.rig_company === undefined)
                    obj.rig_company = null;
                if (obj.rental_number === undefined)
                    obj.rental_number = null;
                if (obj.min_rental_period === undefined)
                    obj.min_rental_period = null;
                if (obj.rental_done === undefined)
                    obj.rental_done = null;
                if (obj.company_recommendation === undefined)
                    obj.company_recommendation = null;
                if (obj.additional_comments === undefined)
                    obj.additional_comments = null;
                if (vm.order.delivery_date == 'Invalid Date')
                    obj.delivery_date = null;
                else
                    obj.delivery_date = vm.order.delivery_date.toLocaleDateString();
                if (vm.order.rental_start_date == 'Invalid Date')
                    obj.rental_start_date = null;
                else
                    obj.rental_start_date = vm.order.rental_start_date.toLocaleDateString();
                if (vm.order.rental_end_date == 'Invalid Date') {
                    obj.rental_end_date = null;
                } else {
                    obj.rental_end_date = vm.order.rental_end_date.toLocaleDateString();
                }

                obj.id = vm.activity_id;
                ActivityService.updateOrder(obj);
                vm.loadActivity(vm.activity_id);
            }, function(error) {
                vm.error = error;
            };

            vm.completeOrder = function() {
                obj = {};
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.completeOrder(obj);
                vm.loadActivity(vm.activity_id);
            }, function(error) {
                vm.error = error;
            };

            vm.removeStatus = function() {
                obj.id = vm.activity_id;
                obj.current_status = vm.activity.current_status;
                ActivityService.removeStatus(obj);
                $state.go('account.activity.quote');
            }, function(error) {
                vm.error = error;
            };

            vm.addCalendarEvent = function (jsEvent) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'AddCalendarEventCtrl',
                    resolve: {
                        activity_id: function () {
                            return vm.activity_id;
                        },
                        profile_id: function () {
                            return vm.user_profile_id;
                        }
                    }
                });
            };

            vm.createOrderDefinition = function() {
                obj = {};
                obj.activity = vm.activity;
                obj.order = vm.order;
                obj.order_type = vm.activity.order_type;
                obj.images = vm.template_images;
                obj.content = vm.quote_template;
                obj.user_profile = vm.user_profile;
                obj.user_profile.full_name = obj.user_profile.first_name + ' ' + obj.user_profile.last_name;
                obj.chosen_rates = vm.chosen_rates;
                obj.contact = vm.contact;
                if (obj.contact.business_phone === undefined)
                    obj.contact.business_phone = "n/a";
                if (obj.contact.cell_phone === undefined)
                    obj.contact.cell_phone = "n/a";
                if (obj.contact.fax === undefined)
                    obj.contact.fax = "n/a";
                if (obj.order.on_site_contact === undefined)
                    obj.order.on_site_contact = " ";
                if (obj.order.on_site_contact_number === undefined)
                    obj.order.on_site_contact_number = " ";
                if (obj.order.location === undefined)
                    obj.order.location = " ";
                if (obj.order.lsd_number === undefined)
                    obj.order.lsd_number = " ";
                if (obj.order.po_number === undefined)
                    obj.order.po_number = " ";
                if (obj.order.application === undefined)
                    obj.order.application = " ";
                if (obj.order.rig_number === undefined)
                    obj.order.rig_number = " ";
                if (obj.order.reason_for_product === undefined)
                    obj.order.reason_for_product = " ";
                if (obj.order.rig_company === undefined)
                    obj.order.rig_company = " ";
                if (obj.order.rental_number === undefined)
                    obj.order.rental_number = " ";
                if (obj.order.min_rental_period === undefined)
                    obj.order.min_rental_period = " ";
                if (obj.order.rental_done === undefined)
                    obj.order.rental_done = " ";
                if (obj.order.delivery_date === undefined)
                    obj.order.delivery_date = " ";
                else
                    obj.delivery_date = obj.order.delivery_date.toLocaleDateString();
                if (obj.order.rental_start_date === undefined)
                    obj.order.rental_start_date = " ";
                else
                    obj.rental_start_date = obj.order.rental_start_date.toLocaleDateString();
                if (obj.order.rental_end_date === undefined)
                    obj.rental_end_date = " ";
                else if (obj.order.rental_end_date == 'Invalid Date')
                    obj.rental_end_date = " ";
                else
                    obj.rental_end_date = obj.order.rental_end_date.toLocaleDateString();

                if (obj.order.company_recommendation === undefined)
                    obj.order.company_recommendation = " ";
                if (obj.order.additional_comments === undefined)
                    obj.order.additional_comments = " ";

                var rateBody = [];
                if (obj.order_type != 'Daily Rate') {
                    var cols = [35, 100, 205, '*', '*', '*'];
                    rateBody.push([{ text: 'Rental Rates', colSpan: 6, alignment: 'center'}, {}, {}, {}, {}, {}]);
                    rateBody.push([{ text: 'Unit #', alignment: 'left' }, { text: 'Name', alignment: 'left' },
                    { text: 'Description', alignment: 'left' }, { text: '4 Week Rate', alignment: 'right' },
                    { text: 'Weekly Rate', alignment: 'right' }, { text: 'Day Rate', alignment: 'right' }]);
                    for (var i = 0; i < obj.chosen_rates.length; i++) {
                        rateBody.push([
                            obj.chosen_rates[i].unit_no,
                            obj.chosen_rates[i].name,
                            obj.chosen_rates[i].description,
                            {text: obj.chosen_rates[i].four_week_rate.toFixed(2), alignment: 'right'},
                            {text: obj.chosen_rates[i].week_rate.toFixed(2), alignment: 'right'},
                            {text: obj.chosen_rates[i].day_rate.toFixed(2), alignment: 'right'},
                        ]);
                    };
                } else {
                    var cols = [35, 175, 225, '*']
                    rateBody.push([{ text: 'Rental Rates', colSpan: 4, alignment: 'center'}, {}, {}, {}]);
                    rateBody.push([{ text: 'Unit #', text: 'Name', alignment: 'left' }, { text: 'Description', alignment: 'left' }, { text: 'Day Rate', alignment: 'right' }]);
                    for (var i = 0; i < obj.chosen_rates.length; i++) {
                        if (obj.chosen_rates[i].unit_no === undefined)
                            var unit_no = "";
                        else
                            var unit_no = obj.chosen_rates[i].unit_no;
                        rateBody.push([
                            unit_no,
                            obj.chosen_rates[i].name,
                            obj.chosen_rates[i].description,
                            {text: obj.chosen_rates[i].day_rate.toFixed(2), alignment: 'right'},
                        ]);
                    };
                }

                var pdf = {
                    content: [
                        {text: 'Rental Order Confirmation (ROC)\n\n', bold: true, alignment: 'center'},
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: [85, '*', 85, '*'],
                                body: [
                                    [{ text: 'Customer Information', colSpan: 2 }, {}, { text: 'Billing Address', colSpan: 2 }, {} ],
                                    ['Company Name:', obj.activity.company_name, 'Address:', obj.contact.address1],
                                    ['Contact Name:', obj.activity.contact_full_name, 'City:', obj.contact.city],
                                    ['Main Office #:', obj.contact.business_phone, 'Province:', obj.contact.province],
                                    ['Cell #:', obj.contact.cell_phone, 'Postal Code:', obj.contact.postal_code],
                                    ['Fax #:', obj.contact.fax, 'Attn:', obj.activity.contact_full_name],
                                    ['E-Mail:', obj.contact.email, {text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}],
                                    [{text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}],
                                    ['On Site Contact:', obj.order.on_site_contact, 'Contact #:', obj.order.on_site_contact_number],
                                    ['Location:', obj.order.location, 'LSD #:', obj.order.lsd_number],
                                    ['Delivery Date', obj.delivery_date, 'PO #', obj.order.po_number],
                                    ['Application', obj.order.application, 'Rig #:', obj.order.rig_number],
                                    ['Reason For Product:', obj.order.reason_for_product, 'Rig Company:', obj.order.rig_company],
                                    [{text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}, {text: 'blank', color: 'white'}],
                                    ['RENTAL TERMS', {text: 'blank', color: 'white'}, 'Rental #:', obj.order.rental_number],
                                    ['Min. Rental Period:', obj.order.min_rental_period, 'Rental Done:', obj.order.rental_done],
                                    ['Rental Start Date:', obj.rental_start_date, 'Rental End Date:', obj.rental_end_date],
                                ],
                            }
                        },
                        //Rental Rates Table
                        {
                            style: 'table',
                            table: {
                                headerRows: 2,
                                widths: cols,
                                body: rateBody,
                            }
                        },
                        {
                            fontSize: 10,
                            text: [
                                'Additional info: (Trucking Rates?services/Etc.)\n\n',
                                'After Hours Agreement Only:\n\n',
                                {text: 'As time is of the essence, and as this Agreement is being entered into outside normal business hours, by signing this Order Confirmation, the undersigned herein agree to be bound by all provisions detailed in the Summary of Terms, Lease Agreement, and all Schedules attached thereto, and that said Agreement shall be duly completed and forwarded to both the Lessee and the Lessor within 10 days of signing this Order Confirmation.\n\n', italics: true},
                            ]
                        },
                        {
                            style: 'table',
                            table: {
                                widths: [200, '*'],
                                body: [
                                    ['How did you hear about our company?', obj.order.company_recommendation],
                                ],
                            }
                        },
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: ['*'],
                                body: [
                                    [{ text: 'Additional Information'}],
                                    [{ text: obj.order.additional_comments}],
                                ],
                            }
                        },
                        {
                            style: 'table',
                            table: {
                                headerRows: 1,
                                widths: [85, '*', 85, '*'],
                                body: [
                                    [{ text: 'Customer', colSpan: 2 }, {}, { text: 'Pro-Energy Sales Rep', colSpan: 2 }, {} ],
                                    ['Name:', obj.activity.company_name, 'Name:', obj.user_profile.full_name],
                                    ['Signature:', {text: 'blank', color: 'white'}, 'Signature:', {text: 'blank', color: 'white'}],
                                ],
                            }
                        },
                    ],
                    styles: {
                        table: {
                            fontSize: 10,
                            margin: [0, 0, 0, 10]
                        }
                    },
                };
                pdfMake.createPdf(pdf).open();
            };

            vm.createOrderPdf = function() {
                vm.createOrderDefinition();
            };

        }


        AddCalendarEventCtrl.$inject = ['$scope', '$state', 'DashboardService', 'ActivityService', '$uibModalInstance', 'profile_id', 'activity_id'];

        function AddCalendarEventCtrl($scope, $state, DashboardService, ActivityService, $uibModalInstance, profile_id, activity_id) {
            var vm = this;
            var obj = {};
            var date = new Date();
            var start = moment(date);
            vm.error = null;
            $scope.event = {};
            vm.user_profile_id = profile_id;
            $scope.activity = {};

            ActivityService.activity(activity_id).$loaded().then(function(res) {
                $scope.activity = res;
                $scope.event.title = $scope.activity.contact_full_name + '-' + $scope.activity.company_name;
            });

            $scope.dateOptions = {
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            $scope.open1 = function() {
                $scope.popup1.opened = true;
            };

            $scope.popup1 = {
                opened: false
            };

            $scope.open2 = function() {
                $scope.popup2.opened = true;
            };

            $scope.popup2 = {
                opened: false
            };

            if (moment(date).minute() < 30) {
                $scope.displayStartTime = moment(date).minute(0).format("HH:mm");
                var remainder = (30 - start.minute()) % 30;
                $scope.displayEndTime = moment(date).add('minutes', remainder).format("HH:mm");
            }

            if (moment(date).minute() > 30) {
                $scope.displayStartTime = moment(date).minute(30).format("HH:mm");
                $scope.displayEndTime = moment(date).add('hour', 1).minute(0).format("HH:mm");
            }

            $scope.event.startDate = date.setMinutes( date.getMinutes() + date.getTimezoneOffset());
            $scope.event.endDate = $scope.event.startDate;

            $scope.saveEvent = function() {
                var newStartTime = document.getElementById("startTime").value;
                var startHr = newStartTime.slice(0,2);
                var startMn = newStartTime.slice(3);
                var newEndTime = document.getElementById("endTime").value;
                var endHr = newEndTime.slice(0,2);
                var endMn = newEndTime.slice(3);
                var newStartDate = new Date($scope.event.startDate);
                var newStartMonth = newStartDate.getMonth();
                var newStartDay = newStartDate.getDate();
                var newStartYear = newStartDate.getFullYear();
                var newEndDate = new Date($scope.event.endDate);
                var newEndMonth = newEndDate.getMonth();
                var newEndDay = newEndDate.getDate();
                var newEndYear = newEndDate.getFullYear();
                obj.title = $scope.event.title;
                obj.subject = $scope.event.subject;
                obj.start = new Date(newStartYear, newStartMonth, newStartDay, startHr, startMn).getTime();
                obj.end = new Date(newEndYear, newEndMonth, newEndDay, endHr, endMn).getTime();
                obj.allDay = false;
                obj.profile_id = vm.user_profile_id;
                DashboardService.addEvent(obj);
                    $uibModalInstance.close();
            }, function(error) {
                vm.error = error;
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }

})();

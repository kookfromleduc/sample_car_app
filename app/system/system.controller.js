(function() {
    'use strict';

     angular
        .module('app.system')
        .controller('ProfilesCtrl', ProfilesCtrl)
        .controller('ProfileCtrl', ProfileCtrl)
        .controller('CustomerSetupCtrl', CustomerSetupCtrl)
        .controller('ActivitySetupCtrl', ActivitySetupCtrl)
        .controller('TemplateCtrl', TemplateCtrl)

        ProfilesCtrl.$inject = ['$state', '$scope', 'ProfileService', 'AdminService', 'authData'];

        function ProfilesCtrl($state, $scope, ProfileService, AdminService, authData) {
            var vm = this;
            var mobileView = 992;

            AdminService.getUser(authData.uid).$loaded().then(function(res) {
                vm.user = res;
                if (vm.user.type === "Sales Admin") {
                    ProfileService.salesProfiles().$loaded().then(function(res) {
                        vm.gridProfiles.data = res;
                    });
                } else {
                    ProfileService.profiles().$loaded().then(function(res) {
                        vm.gridProfiles.data = res;
                    });
                };
            });

            vm.editProfile = function(row) {
                $state.go('account.system.profile', {'rowEntity': row.entity});
            };

            vm.gridProfiles = {
                showGridFooter: true,
                enableSorting: true,
                enableCellEditOnFocus: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/system/gridTemplates/editProfile.html',
                        width: 34, enableColumnMenu: false, headerTooltip: 'Edit Profile', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name: 'name', field: 'name', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '25%' },
                    { name: 'email', field: 'email', enableHiding: false, width: '20%', enableCellEdit: false },
                    { name: 'type', field: 'type', enableHiding: false, width: '15%', enableCellEdit: false },
                    { name: 'status', field: 'status', enableHiding: false, width: '15%', enableCellEdit: false },
                    { name: 'dateAdded', field: 'date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                        enableCellEdit: false, cellFilter: 'date' }
                ]
            };
        }

        ProfileCtrl.$inject = ['$state', '$scope', '$stateParams', 'ProfileService', 'AuthService', 'AdminService', 'authData'];

        function ProfileCtrl($state, $scope, $stateParams, ProfileService, AuthService, AdminService, authData) {
            var vm = this;
            var obj = {};
            vm.profile_id = {}
            vm.profile = {};
            ProfileService.profiles().$loaded().then(function(res) {
                vm.totalCount = res.length;
            });

            vm.loadProfile = function(id) {
                ProfileService.loadProfile(id).$loaded().then(function(res) {
                    vm.profile = res;
                    vm.profileIndex = ProfileService.index(id);
                });
            };
            if ($stateParams.rowEntity != undefined) {
                vm.profile_id = $stateParams.rowEntity.$id;
                vm.loadProfile($stateParams.rowEntity.$id);
            } else {
                vm.profile_id = null;
            }

            vm.addProfile = function() {
                obj = {};
                obj = vm.profile;
                vm.profile.calendar = {};
                vm.profile.calendar.name = 'myCalendar';
                vm.profile.name = vm.profile.first_name + ' ' + vm.profile.last_name;
                ProfileService.addProfile(obj).then(function(key) {
                    vm.profile_id = key;
                });
            }, function(error) {
                vm.error = error;
            };

            vm.forgotPassword = function() {
                Auth.$resetPassword( {
                    email: vm.profile.profile_email
                }).then(function() {
                    AlertService.addSuccess(Messages.send_email_success);
                }).catch(function(error) {
                    console.error("Error: ", error);
                });
            };

            vm.updateProfile = function() {
                obj = {}
                vm.profile.name = vm.profile.first_name + ' ' + vm.profile.last_name;
                if (vm.profile_id != null)
                    vm.profile.$save();
                    obj.type = vm.profile.type;
                    obj.uid = authData.uid;
                    AdminService.updateUserType(obj);
            }, function(error) {
                vm.error = error;
            };

            vm.next = function() {
                var key = vm.profileIndex + 1;
                if (key != vm.totalCount) {
                    vm.profile_id = ProfileService.key(key);
                    vm.loadProfile(vm.profile_id);
                }
            }, function(error) {
                vm.error = error;
            };

            vm.back = function() {
                var key = vm.profileIndex - 1;
                if (key < 0) key = 0
                vm.profile_id = ProfileService.key(key);
                vm.loadProfile(vm.profile_id);
            }, function(error) {
                vm.error = error;
            };

            vm.first = function() {
                vm.profile_id = ProfileService.key(0);
                vm.loadProfile(vm.profile_id);
            }, function(error) {
                vm.error = error;
            };

            vm.last = function() {
                vm.profile_id = ProfileService.key(vm.totalCount - 1);
                vm.loadProfile(vm.profile_id);
            }, function(error) {
                vm.error = error;
            };
        }

        CustomerSetupCtrl.$inject = ['$state', '$scope', 'CustomerSetupService'];

        function CustomerSetupCtrl($state, $scope, CustomerSetupService) {
            var vm = this;
            var mobileView = 992;
            var obj = {};
            var cnt = {};

            CustomerSetupService.industryGroups().$loaded().then(function(res) {
                vm.gridIndustryGroups.data = res;
            });

            CustomerSetupService.businessUnits().$loaded().then(function(res) {
                vm.gridBusinessUnits.data = res;
            });

            CustomerSetupService.regions().$loaded().then(function(res) {
                vm.gridRegions.data = res;
            });

            CustomerSetupService.revenueGroups().$loaded().then(function(res) {
                vm.gridRevenueGroups.data = res;
            });

            CustomerSetupService.targetProfile().$loaded().then(function(res) {
                vm.target_attributes = res.attributes;
                vm.target_objectives = res.objectives;
            });

            CustomerSetupService.prospectProfile().$loaded().then(function(res) {
                vm.prospect_attributes = res.attributes;
                vm.prospect_objectives = res.objectives;
            });

            CustomerSetupService.customerProfile().$loaded().then(function(res) {
                vm.customer_attributes = res.attributes;
                vm.customer_objectives = res.objectives;
            });

            vm.updateProfileAttributes = function(type) {
                obj.type = type;
                if (type === 'target')
                    obj.attributes = vm.target_attributes;
                if (type === 'prospect')
                    obj.attributes = vm.prospect_attributes;
                if (type === 'customer')
                    obj.attributes = vm.customer_attributes;
                CustomerSetupService.updateProfileAttributes(obj);
            }

            vm.updateProfileObjectives = function(node) {
                obj.node = node;
                if (node === 'target')
                    obj.objectives = vm.target_objectives;
                if (node === 'prospect')
                    obj.objectives = vm.prospect_objectives;
                if (node === 'customer')
                    obj.objectives = vm.customer_objectives;
                CustomerSetupService.updateProfileObjectives(obj);
            }

            vm.removeNode = function(row, node) {
                CustomerSetupService.removeNode(row.entity.$id, node);
            }, function(error) {
                vm.error = error;
            };

            vm.addNode = function(node) {
                obj.node = node;
                if (node === 'revenue_group') {
                    obj.name = vm.revenue_group.name;
                    vm.revenue_group.name = null;
                }
                if (node === 'industry_group') {
                    obj.name = vm.industry_group.name;
                    vm.industry_group.name = null;
                }
                if (node === 'business_unit') {
                    obj.name = vm.business_unit.name;
                    vm.business_unit.name = null;
                }
                if (node === 'region') {
                    obj.name = vm.region.name;
                    vm.region.name = null;
                }
                CustomerSetupService.addNode(obj);
            }, function(error) {
                vm.error = error;
            };

            vm.gridIndustryGroups = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'industryGroup', field: 'name', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeIndustryGroup.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridBusinessUnits = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'businessUnit', field: 'name', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeBusinessUnit.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridRegions = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'region', field: 'name', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeRegion.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridRevenueGroups = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'revenueGroup', field: 'name', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeRevenueGroup.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };
        }

        ActivitySetupCtrl.$inject = ['$state', '$q', '$scope', 'ActivitySetupService'];

        function ActivitySetupCtrl($state, $q, $scope, ActivitySetupService) {
            var vm = this;
            var mobileView = 992;
            var obj = {};
            var cnt = 0;

            ActivitySetupService.salesActivities().$loaded().then(function(res) {
                vm.gridSalesActivities.data = res;
            });

            ActivitySetupService.preferences().$loaded().then(function(res) {
                vm.gridPreferences.data = res;
            });

            ActivitySetupService.kpis().$loaded().then(function(res) {
                vm.gridKpis.data = res;
            });

            ActivitySetupService.businessQuestions().$loaded().then(function(res) {
                vm.gridBusinessQuestions.data = res;
            });

            ActivitySetupService.solutionQuestions().$loaded().then(function(res) {
                vm.gridSolutionQuestions.data = res;
            });

            vm.addPreference = function(node) {
                obj.node = node;
                ActivitySetupService.preferencesSnapShot().once('value').then(function(res) {
                    cnt = res.numChildren();
                    cnt = cnt + 1;
                    obj.name = 'preference'+ cnt;
                    obj.label = vm.preference.label;
                    vm.preference.label = null;
                    ActivitySetupService.addPreference(obj);
                });
            }, function(error) {
                vm.error = error;
            };

            vm.addKpi = function(node) {
                obj.node = node;
                ActivitySetupService.kpisSnapShot().once('value').then(function(res) {
                    cnt = res.numChildren();
                    cnt = cnt + 1;
                    obj.name = 'kpi'+ cnt;
                    obj.label = vm.kpi.label;
                    vm.kpi.label = null;
                    ActivitySetupService.addKpi(obj);
                });
            }, function(error) {
                vm.error = error;
            };

            vm.gridPreferences = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'preference', field: 'label', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removePreference.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridKpis = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'keyPerformanceIndicator', field: 'label', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeKpi.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.updateBusinessQuestion = function(obj) {
                ActivitySetupService.updateBusinessQuestion(obj);
                $state.reload();
            }, function(error) {
                vm.error = error;
            };

            vm.updateSolutionQuestion = function(obj) {
                ActivitySetupService.updateSolutionQuestion(obj);
            }, function(error) {
                vm.error = error;
            };

            vm.removeNode = function(row, node) {
                ActivitySetupService.removeNode(row.entity.$id, node);
            }, function(error) {
                vm.error = error;
            };

            vm.addNode = function(node) {
                obj.node = node;
                if (node === 'sales_activity') {
                    obj.name = vm.sales_activity.name;
                    vm.sales_activity.name = null;
                    ActivitySetupService.addNode(obj);
                }
                if (node === 'business_question') {
                    ActivitySetupService.businessQuestionsSnapShot().once('value').then(function(res) {
                        cnt = res.numChildren();
                        cnt = cnt + 1;
                        obj.name = 'question'+ cnt;
                        obj.question = vm.business_question.question;
                        vm.business_question.question = null;
                        ActivitySetupService.addNode(obj);
                    });
                }
                if (node === 'solution_question') {
                    ActivitySetupService.solutionQuestionsSnapShot().once('value').then(function(res) {
                        cnt = res.numChildren();
                        cnt = cnt + 1;
                        obj.name = 'question'+ cnt;
                        obj.question = vm.solution_question.question;
                        vm.solution_question.question = null;
                        ActivitySetupService.addNode(obj);
                    });
                }
            }, function(error) {
                vm.error = error;
            };

            vm.saveBusinessQuestion = function(obj) {
                var promise = $q.defer();
                $scope.gridApi.rowEdit.setSavePromise( obj, promise.promise );
                ActivitySetupService.updateBusinessQuestion(obj);
                promise.resolve();
            }, function(error) {
                vm.error = error;
            };

            vm.saveSolutionQuestion = function(obj) {
                var promise = $q.defer();
                $scope.gridApi.rowEdit.setSavePromise( obj, promise.promise );
                ActivitySetupService.updateSolutionQuestion(obj);
                promise.resolve();
            }, function(error) {
                vm.error = error;
            };

            vm.gridSalesActivities = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'salesActivity', field: 'name', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeSalesActivity.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridBusinessQuestions = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'businessQuestions', field: 'question', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeBusinessQuestion.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridBusinessQuestions.onRegisterApi = function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.rowEdit.on.saveRow($scope, vm.saveBusinessQuestion);
            };

            vm.gridSolutionQuestions = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'solutionQuestions', field: 'question', enableHiding: false, enableCellEdit: true},
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeSolutionQuestion.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridSolutionQuestions.onRegisterApi = function(gridApi) {
                $scope.gridApi = gridApi;
                gridApi.rowEdit.on.saveRow($scope, vm.saveSolutionQuestion);
            };

        }

        TemplateCtrl.$inject = ['$state', '$q', '$scope', 'Upload', 'TemplateService'];

        function TemplateCtrl($state, $q, $scope, Upload, TemplateService ) {
            var vm = this;
            var obj = {};
            var mobileView = 992;
            var storageRef = firebase.storage().ref();
            vm.quote = {};
            vm.rate = {};
            vm.shift = {};
            vm.order = {};
            vm.additional_service = {};
            vm.template_images = {};

            TemplateService.quote().$loaded().then(function(res) {
                vm.quote = res;
            });

            TemplateService.templateImages().$loaded().then(function(res) {
                vm.template_images = res;
            });

            TemplateService.ratesByShift().$loaded().then(function(res) {
                vm.gridRatesByShift.data = res;
            });

            TemplateService.services().$loaded().then(function(res) {
                vm.gridServices.data = res;
            });

            TemplateService.transportation().$loaded().then(function(res) {
                vm.gridTransportation.data = res;
            });

            vm.updateSubjectLine = function() {
                TemplateService.updateSubjectLine(vm.quote);
            };

            vm.updatePreamble = function() {
                TemplateService.updatePreamble(vm.quote);
            };

            vm.updateMarketing = function() {
                TemplateService.updateMarketing(vm.quote);
            };

            vm.addRate = function() {
                TemplateService.addRate(vm.rate);
                vm.rate = null;
            };

            vm.addShift = function() {
                TemplateService.addShift(vm.shift);
                vm.shift = null;
            };

            vm.addService = function() {
                TemplateService.addService(vm.service);
                vm.service = null;
            };

            vm.addTransportation = function() {
                TemplateService.addTransportation(vm.transportation);
                vm.transportation = null;
            };

            vm.updateClosingStatement = function() {
                TemplateService.updateClosingStatement(vm.quote);
            };

            vm.updateTemplateImage = function(file, type) {
                obj = {};
                Upload.base64DataUrl(file).then(function(url) {
                    obj.base64 = url;
                });
                var metadata = {
                    'contentType': file.type
                };
                if (metadata.contentType === 'image/jpeg') obj.icon = 'fa-file-image-o';
                if (metadata.contentType === 'image/gif') obj.icon = 'fa-file-image-o';
                if (metadata.contentType === 'image/png') obj.icon = 'fa-file-image-o';
                if (type === 'header')
                    var node = 'template_images/header_image/';
                else if (type === 'footer')
                    var node = 'template_images/footer_image/';
                else
                    var node = 'template_images/signature_image/';

                var uploadTask = storageRef.child(node + file.name).put(file, metadata);
                uploadTask.on('state_changed', null, function(error) {
                    vm.error = error;
                }, function() {
                    obj.node = node;
                    obj.total_bytes = uploadTask.snapshot.totalBytes;
                    obj.content_type = uploadTask.snapshot.metadata.contentType;
                    obj.name = uploadTask.snapshot.metadata.name;
                    obj.url = uploadTask.snapshot.metadata.downloadURLs[0];
                    TemplateService.updateTemplateImage(obj);
                });
            };

            vm.gridRatesByShift = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'shift', field: 'label', enableHiding: false },
                    { name: 'runtime', field: 'runtime', enableHiding: false },
                    { name: '% OfCost', field: 'percent_of_cost', enableHiding: false, cellClass: 'grid-align-right'}
                ]
            };

            vm.removeNode = function(row, node) {
                TemplateService.removeNode(row.entity.$id, node);
            }, function(error) {
                vm.error = error;
            };

            vm.addNode = function(node) {
                obj.node = node;
                if (node === 'service') {
                    obj.service = vm.marketing_service;
                    vm.marketing_service = null;
                    TemplateService.addNode(obj);
                };
                if (node === 'transportation') {
                    obj.transportation = vm.marketing_transportation;
                    vm.marketing_transportation = null;
                    TemplateService.addNode(obj);
                };
            }, function(error) {
                vm.error = error;
            };

            vm.saveService = function(obj) {
                var promise = $q.defer();
                $scope.gridServicesApi.rowEdit.setSavePromise( obj, promise.promise );
                TemplateService.updateService(obj);
                promise.resolve();
            }, function(error) {
                vm.error = error;
            };

            vm.saveTransportation = function(obj) {
                var promise = $q.defer();
                $scope.gridTransportationApi.rowEdit.setSavePromise( obj, promise.promise );
                TemplateService.updateTransportation(obj);
                promise.resolve();
            }, function(error) {
                vm.error = error;
            };

            vm.gridServices = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'serviceOptions', field: 'service', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeService.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridServices.onRegisterApi = function(gridServicesApi) {
                $scope.gridServicesApi = gridServicesApi;
                gridServicesApi.rowEdit.on.saveRow($scope, vm.saveService);
            };

            vm.gridTransportation = {
                enableSorting: true,
                enableCellEditOnFocus: true,
                columnDefs: [
                    { name: 'transportationOptions', field: 'transportation', enableHiding: false },
                    { name: ' ', field: '$id', cellTemplate:'app/system/gridTemplates/removeTransportation.html',
                        width: 35, enableCellEdit: false, enableColumnMenu: false }
                ]
            };

            vm.gridTransportation.onRegisterApi = function(gridTransportationApi) {
                $scope.gridTransportationApi = gridTransportationApi;
                gridTransportationApi.rowEdit.on.saveRow($scope, vm.saveTransportation);
            };

            vm.updateAdditionalInfo = function() {
                TemplateService.updateAdditionalInfo(vm.order);
            };

        }

})();

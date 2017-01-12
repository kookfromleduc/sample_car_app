(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl)
        .controller('AddEventCtrl', AddEventCtrl)
        .controller('UpdateEventCtrl', UpdateEventCtrl)

        DashboardCtrl.$inject = ['$state', '$scope', 'DashboardService', 'AuthService', 'AssetService', 'ProfileService', 'CompanyService',
            'ContactService', 'ActivitiesService', '$uibModal', 'uiCalendarConfig'];

        function DashboardCtrl($state, $scope, DashboardService, AuthService, AssetService, ProfileService, CompanyService,
            ContactService, ActivitiesService, $uibModal, uiCalendarConfig) {
            var vm = this;
            vm.error = null;
            vm.contactCount = {};
            vm.activityCount = {};
            vm.cellTemplate = 'app/activities/gridTemplates/activityTemplate.html';
            vm.eventSources = [];
            $scope.events = [];

            vm.loadEvents = function (id) {
                DashboardService.loadEvents(id).$loaded().then(function(res) {
                    for(var i = 0; i < res.length; i++) {
                        var obj = {
                            title: res[i].title,
                            start: new Date(res[i].start),
                            end: new Date(res[i].end),
                            allDay: res[i].allDay,
                            id: res[i].id
                        }
                        $scope.events.push(obj)
                    };
                    vm.eventSources = [$scope.events];
                    vm.eventsLoaded = true;
                });
            }

            var user = AuthService.isLoggedIn();
            DashboardService.loadUser(user.uid).$loaded().then(function(res) {
                ProfileService.loadProfile(res.profile_id).$loaded().then(function(res) {
                    vm.profile_id = res.$id;
                    vm.loadEvents(vm.profile_id);
                });
            });

            vm.eventClick = function (event, jsEvent, view) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'UpdateEventCtrl',
                    resolve: {
                        event: function () {
                            return event;
                        },
                        view: function () {
                            return view;
                        },
                        profile_id: function () {
                            return vm.profile_id;
                        }
                    }
                }).result.then(function() {
                    $scope.events.splice(0, $scope.events.length);
                    vm.loadEvents(vm.profile_id);
                });
            };

            vm.dayClick = function (date, jsEvent, view) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'myModalContent.html',
                    controller: 'AddEventCtrl',
                    resolve: {
                        date: function () {
                            return date;
                        },
                        view: function () {
                            return view;
                        },
                        profile_id: function () {
                            return vm.profile_id;
                        }
                    }
                }).result.then(function() {
                    $scope.events.splice(0, $scope.events.length);
                    vm.loadEvents(vm.profile_id);
                });
            };

            vm.uiConfig = {
                calendar: {
                    height: 425,
                    editable: true,
                    header: {
                        left: 'month agendaWeek agendaDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    dayClick: vm.dayClick,
                    eventClick: vm.eventClick
                }
            };

            AssetService.assets().$loaded().then(function(res){
                vm.assetCount = res.length;
            });

            CompanyService.companies().$loaded().then(function(res) {
                vm.companyCount = res.length;
            });

            ContactService.contacts().$loaded().then(function(res) {
                vm.contactCount = res.length;
            });

            ActivitiesService.activities().$loaded().then(function(res) {
                vm.activityCount = res.length;
            });

            ActivitiesService.myActivities(user.uid).$loaded().then(function(res) {
                vm.gridMyActivities.data = res;
            });

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

            vm.gridMyActivities = {
                enableSorting: false,
                enableColumnMenus: false,
                enableCellEditOnFocus: false,
                enableFiltering: false,
                enableHiding: false,
                columnDefs: [
                    { name:'dateAdded', field: 'info_date_added', sort: { direction: 'desc' }, cellFilter: 'date',  width: '20%' },
                    { name:'contactName', field: 'contact_full_name', width: '20%' },
                    { name: 'activityStatus', field: 'info_status_label', cellTemplate: vm.cellTemplate, enableHiding: false, enableCellEdit: false,
                        enableFiltering: false, enableSorting: false, headerTooltip: 'Edit Activity'}
                ]
            };

        }

        AddEventCtrl.$inject = ['$scope', '$state', 'DashboardService', '$uibModalInstance', 'date', 'view', 'profile_id'];

        function AddEventCtrl($scope, $state, DashboardService, $uibModalInstance, date, view, profile_id) {
            var vm = this;
            var obj = {};
            vm.error = null;
            $scope.event = {};
            vm.profile_id = profile_id;

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

            if (view.type === 'month') {
                if (moment(date).minute() < 30)
                    $scope.displayStartTime = moment(date).minute(0).format("HH:mm");
                if (moment(date).minute() > 30)
                    $scope.displayStartTime = moment(date).minute(30).format("HH:mm");
                $scope.displayEndTime = moment(date).add(30, 'm').format("HH:mm")
            }

            if (view.type === 'agendaWeek' || view.type === 'agendaDay') {
                $scope.displayStartTime = moment(date).format("HH:mm");
                $scope.displayEndTime = moment(date).add(30, 'm').format("HH:mm")
            }

            var d = date.toDate();
            $scope.event.startDate = d.setMinutes( d.getMinutes() + d.getTimezoneOffset());
            $scope.event.endDate = $scope.event.startDate;

            $scope.saveEvent = function () {
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
                obj.start = new Date(newStartYear, newStartMonth, newStartDay, startHr, startMn).getTime();
                obj.end = new Date(newEndYear, newEndMonth, newEndDay, endHr, endMn).getTime();
                obj.allDay = false;
                obj.profile_id = vm.profile_id;
                DashboardService.addEvent(obj);
                    $uibModalInstance.close();
            }, function(error) {
                vm.error = error;
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }

        UpdateEventCtrl.$inject = ['$scope', 'DashboardService', '$uibModalInstance', 'view', 'event', 'profile_id'];

        function UpdateEventCtrl($scope, DashboardService, $uibModalInstance, view, event, profile_id) {
            var vm = this;
            var obj = {};
            var newEvent = {};
            vm.error = null;
            $scope.event = {};
            vm.profile_id = profile_id;

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

            obj.profile_id = vm.profile_id;
            obj.id = event.id;
            DashboardService.loadEvent(obj).$loaded().then(function(res) {
                $scope.event.title = res.title;
                $scope.displayStartTime = moment(res.start).format("HH:mm");
                $scope.displayEndTime = moment(res.end).format("HH:mm");
                $scope.event.startDate = new Date(res.start);
                $scope.event.endDate = new Date(res.end);
            });

            $scope.saveEvent = function () {
                var startTime = document.getElementById("startTime").value;
                var startHr = startTime.slice(0,2);
                var startMn = startTime.slice(3);
                var endTime = document.getElementById("endTime").value;
                var endHr = endTime.slice(0,2);
                var endMn = endTime.slice(3);
                var startDate = new Date($scope.event.startDate);
                var startMonth = startDate.getMonth();
                var startDay = startDate.getDate();
                var startYear = startDate.getFullYear();
                var endDate = new Date($scope.event.endDate);
                var endMonth = endDate.getMonth();
                var endDay = endDate.getDate();
                var endYear = endDate.getFullYear();
                obj.title = $scope.event.title;
                obj.start = new Date(startYear, startMonth, startDay, startHr, startMn).getTime();
                obj.end = new Date(endYear, endMonth, endDay, endHr, endMn).getTime();
                obj.allDay = false;
                obj.profile_id = vm.profile_id;
                DashboardService.updateEvent(obj);
                    $uibModalInstance.close();
            }, function(error) {
                vm.error = error;
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }

})();

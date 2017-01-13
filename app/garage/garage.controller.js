(function() {
    'use strict';

     angular
        .module('app.garage')
        .controller('carsCtrl', carsCtrl)
        .controller('carCtrl', carCtrl)

        carsCtrl.$inject = ['$state', '$scope', '$stateParams', 'carsService'];

        function carsCtrl($state, $scope, $stateParams, carsService) {

            var vm = this;

            carsService.cars().$loaded().then(function(res) {
                vm.gridCars.data = res;
            });

            vm.gridCars = {
                showGridFooter: true,
                enableSorting: true,
                enableCellEditOnFocus: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/garage/gridTemplates/editCar.html',
                    width: 34, enableColumnMenu: false, headerTooltip: 'Edit Product', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name:'manufacture', field: 'manufacture', enableHiding: false, enableFiltering: true, enableCellEdit: false},
                    { name:'make', field: 'make', enableHiding: false, enableFiltering: true, enableCellEdit: false},
                    { name:'year', field: 'year', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '10%', cellClass: 'grid-align-right' },
                    { name:'color', field: 'color', enableHiding: false, width: '10%', enableCellEdit: false, cellClass: 'grid-align-right'},
                    { name:'passengerSeating', field: 'passenger_seating', enableHiding: false, enableCellEdit: false, cellClass: 'grid-align-right'},
                    { name: ' ', field: '$id', cellTemplate:'app/garage/gridTemplates/removeCar.html',
                    width: 32, enableColumnMenu: false, enableCellEdit: false, enableFiltering: false }
                ]
            };

            vm.removeCar = function(row) {
                  carsService.removeCar(row.entity.$id);
            }, function(error) {
                  vm.error = error;
            };

            vm.editCar = function(row) {
                  $state.go('car', {'rowEntity': row.entity});
            };

      }

        carCtrl.$inject = ['$state', '$scope', '$stateParams', 'carsService'];

        function carCtrl($state, $scope, $stateParams, carsService) {
            var vm = this;
            var mobileView = 992;

            vm.car = {};
            vm.car_id = {};
            carsService.cars().$loaded().then(function(res) {
                vm.totalCount = res.length;
            });

            vm.updateCar = function() {
            if (vm.car_id != null)
                vm.car.$save();
            }, function(error) {
                storeCtrl.error = error;
            };

            vm.loadCar = function(id) {
                carsService.car(id).$loaded().then(function(res) {
                          vm.car = res;
                          vm.carIndex = carsService.index(id);
                    });
            };

            vm.addCar = function() {
                carsService.addCar(vm.car).then(function(id) {
                    vm.car_id = id;
                    vm.loadCar(id);
                });
            }, function(error) {
                vm.error = error;
            };

            if ($stateParams.rowEntity != undefined) {
                vm.car_id = $stateParams.rowEntity.$id;
                vm.loadCar($stateParams.rowEntity.$id);
            } else {
                vm.car_id = null;
            };

            vm.next = function() {
                var key = vm.carIndex + 1;
                if (key != vm.totalCount) {
                    vm.loadCar(carsService.key(key));
                }

            }, function(error) {
                vm.error = error;
            };

            vm.back = function() {
                var key = vm.carIndex - 1;

                if (key < 0) key = 0
                    vm.loadCar(carsService.key(key));

            }, function(error) {
                vm.error = error;
            };

            vm.first = function() {
                vm.loadCar(carsService.key(0));

            }, function(error) {
                vm.error = error;
            };

            vm.last = function() {
                vm.loadCar(carsService.key(vm.totalCount - 1));

            }, function(error) {
                vm.error = error;
            };

        }

})();

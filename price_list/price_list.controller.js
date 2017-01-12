(function() {
    'use strict';

     angular
        .module('app.price_list')
        .controller('PriceListCtrl', PriceListCtrl)
        .controller('PriceCtrl', PriceCtrl)

        PriceListCtrl.$inject = ['$state', '$scope', '$stateParams', 'PriceListService'];

        function PriceListCtrl($state, $scope, $stateParams, PriceListService) {

            var vm = this;
            /*vm.listButtons = true;
            $scope.file = {};*/

            PriceListService.price_list().$loaded().then(function(res) {
                vm.gridPriceList.data = res;
            });

            vm.gridPriceList = {
                showGridFooter: true,
                enableSorting: true,
                enableCellEditOnFocus: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/price_list/gridTemplates/editPrice.html',
                    width: 34, enableColumnMenu: false, headerTooltip: 'Edit Product', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name:'name', field: 'name', enableHiding: false, enableFiltering: true, enableCellEdit: false},
                    { name:'category', field: 'category', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '15%'},
                    { name:'powerOutput', field: 'power_output', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '15%', cellClass: 'grid-align-right' },
                    { name:'dayRate', field: 'day_rate', enableHiding: false, width: '13%', enableCellEdit: false, cellClass: 'grid-align-right', cellFilter: 'currency' },
                    { name:'week_rate', field: 'week_rate', enableHiding: false, width: '13%', enableCellEdit: false, cellClass: 'grid-align-right', cellFilter: 'currency' },
                    { name:'4 weekRate', field: 'four_week_rate', width: '13%', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'currency' },
                    { name: ' ', field: '$id', cellTemplate:'app/price_list/gridTemplates/removePrice.html',
                    width: 32, enableColumnMenu: false, enableCellEdit: false, enableFiltering: false }
                ]
            };

            vm.removePrice = function(row) {
                  PriceListService.removePrice(row.entity.$id);
            }, function(error) {
                  vm.error = error;
            };

            vm.editPrice = function(row) {
                  $state.go('account.price_list.price', {'rowEntity': row.entity});
            };

      }

        PriceCtrl.$inject = ['$state', '$scope', '$stateParams', 'PriceListService', 'DataService'];

        function PriceCtrl($state, $scope, $stateParams, PriceListService, DataService) {
            var vm = this;
            var mobileView = 992;

            vm.price = {};
            vm.price_id = {};
            PriceListService.price_list().$loaded().then(function(res) {
                vm.totalCount = res.length;;
            });

            vm.tinymceOptions = {
                menubar:false,
                statusbar: false,
                theme: "modern",
                skin: 'light',
                height: 250
            };

            vm.updatePrice = function() {
            if (vm.price_id != null)
                vm.price.$save();
            }, function(error) {
                storeCtrl.error = error;
            };

            vm.loadPrice = function(id) {
                PriceListService.price(id).$loaded().then(function(res) {
                          vm.price = res;
                          vm.priceIndex = PriceListService.index(id);
                    });
            };

            vm.addPrice = function() {
                vm.price.view_status = true;
                PriceListService.addPrice(vm.price).then(function(id) {
                    vm.price_id = id;
                    vm.loadPrice(id);
                });
            }, function(error) {
                vm.error = error;
            };

            if ($stateParams.rowEntity != undefined) {
                vm.price_id = $stateParams.rowEntity.$id;
                vm.loadPrice($stateParams.rowEntity.$id);
            } else {
                vm.price_id = null;
            };

            vm.next = function() {
                var key = vm.priceIndex + 1;
                if (key != vm.totalCount) {
                    vm.loadPrice(PriceListService.key(key));
                }

            }, function(error) {
                vm.error = error;
            };

            vm.back = function() {
                var key = vm.priceIndex - 1;

                if (key < 0) key = 0
                    vm.loadPrice(PriceListService.key(key));

            }, function(error) {
                vm.error = error;
            };

            vm.first = function() {
                vm.loadPrice(PriceListService.key(0));

            }, function(error) {
                vm.error = error;
            };

            vm.last = function() {
                vm.loadPrice(PriceListService.key(vm.totalCount - 1));

            }, function(error) {
                vm.error = error;
            };

        }

})();

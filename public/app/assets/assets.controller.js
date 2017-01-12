(function() {
    'use strict';

     angular
        .module('app.assets')
        .controller('AssetsCtrl', AssetsCtrl)
        .controller('AssetCtrl', AssetCtrl)

        AssetsCtrl.$inject = ['$state', '$scope', '$stateParams', 'AssetService'];

        function AssetsCtrl($state, $scope, $stateParams, AssetService) {

            var vm = this;
            /*vm.listButtons = true;
            $scope.file = {};*/

            AssetService.assets().$loaded().then(function(res) {
                vm.gridAssets.data = res;
            });

            vm.gridAssets = {
                showGridFooter: true,
                enableSorting: true,
                enableCellEditOnFocus: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/assets/gridTemplates/editAsset.html',
                    width: 34, enableColumnMenu: false, headerTooltip: 'Edit Asset', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name:'assetName', field: 'name', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '25%' },
                    { name:'unitNumber', field: 'unit_number', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '15%', cellClass: 'grid-align-right' },
                    { name:'assetCode', field: 'code', enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '15%', cellClass: 'grid-align-right' },
                    { name:'status', field: 'status', enableHiding: false, width: '10%', enableCellEdit: false, cellClass: 'grid-align-right' },
                    { name:'value', field: 'price', enableHiding: false, width: '15%', enableCellEdit: false, cellClass: 'grid-align-right' },
                    { name:'dateAdded', field: 'date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date' },
                    { name: ' ', field: '$id', cellTemplate:'app/assets/gridTemplates/removeAsset.html',
                    width: 32, enableColumnMenu: false, enableCellEdit: false, enableFiltering: false }
                ]
            };

            vm.removeAsset = function(row) {
                  AssetService.removeAsset(row.entity.$id);
            }, function(error) {
                  vm.error = error;
            };

            vm.editAsset = function(row) {
                  $state.go('account.assets.asset', {'rowEntity': row.entity});
            };

      }

        AssetCtrl.$inject = ['$state', '$scope', '$stateParams', 'AssetService'];

        function AssetCtrl($state, $scope, $stateParams, AssetService) {
            var vm = this;
            var mobileView = 992;

            vm.asset = {};
            vm.asset_id = {};
            AssetService.assets().$loaded().then(function(res) {
                vm.totalCount = res.length;;
            });
            AssetService.industryGroups().$loaded().then(function(res) {
                vm.industryGroups = res;
            });

            vm.tinymceOptions = {
                menubar:false,
                statusbar: false,
                theme: "modern",
                skin: 'light',
                height: 250
            };

            vm.updateAsset = function() {
            if (vm.asset_id != null)
                vm.asset.$save();
            }, function(error) {
                storeCtrl.error = error;
            };

            vm.loadAsset = function(id) {
                AssetService.asset(id).$loaded().then(function(res) {
                          vm.asset = res;
                          vm.assetIndex = AssetService.index(id);
                    });

            };

            vm.addAsset = function() {
                vm.asset.view_status = true;
                AssetService.addAsset(vm.asset).then(function(id) {
                    vm.loadAsset(id);
                    vm.asset_id = id;
                });
            }, function(error) {
                vm.error = error;
            };

            if ($stateParams.rowEntity != undefined) {
                vm.asset_id = $stateParams.rowEntity.$id;
                vm.loadAsset($stateParams.rowEntity.$id);
            } else {
                vm.asset_id = null;
            };

            vm.next = function() {
                var key = vm.assetIndex + 1;
                if (key != vm.totalCount) {
                    vm.loadAsset(AssetService.key(key));
                }

            }, function(error) {
                vm.error = error;
            };

            vm.back = function() {
                var key = vm.assetIndex - 1;

                if (key < 0) key = 0
                    vm.loadAsset(AssetService.key(key));

            }, function(error) {
                vm.error = error;
            };

            vm.first = function() {
                vm.loadAsset(AssetService.key(0));

            }, function(error) {
                vm.error = error;
            };

            vm.last = function() {
                vm.loadAsset(AssetService.key(vm.totalCount - 1));

            }, function(error) {
                vm.error = error;
            };

        }
})();

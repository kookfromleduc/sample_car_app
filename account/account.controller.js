(function() {
    'use strict';

     angular
        .module('app.account')
        .controller('AccountCtrl', AccountCtrl)
        .controller('UserProfileCtrl', UserProfileCtrl)

        AccountCtrl.$inject = ['$state', '$scope', 'AuthService', 'AdminService', 'ProfileService', '$cookies', 'authData'];

        function AccountCtrl($state, $scope, AuthService, AdminService, ProfileService, $cookies, authData) {
            var vm = this;
            var mobileView = 992;

            AdminService.getUser(authData.uid).$loaded().then(function(res) {
                ProfileService.loadProfile(res.profile_id).$loaded().then(function(profile) {
                    if (profile.type === "Admin") {
                        $scope.items = [
                            {link: ".dashboard", name: "Dashboard", icon: "menu-icon fa fa-tachometer"},
                            {link: ".customers", name: "Customers", icon: "menu-icon fa fa-heartbeat"},
                            {link: ".activities", name: "Activities", icon: "menu-icon fa fa-share-alt"},
                            {link: ".price_list", name: "Price List", icon: "menu-icon fa fa-list"},
                            {link: ".assets", name: "Assets", icon: "menu-icon fa fa-th"},
                            {link: ".system", name: "System", icon: "menu-icon fa fa-gears"},
                            {link: ".tools", name: "Tools", icon: "menu-icon fa fa-wrench"}
                        ];
                    };

                    if (profile.type === "Sales Admin") {
                        $scope.items = [
                            {link: ".dashboard", name: "Dashboard", icon: "menu-icon fa fa-tachometer"},
                            {link: ".customers", name: "Customers", icon: "menu-icon fa fa-heartbeat"},
                            {link: ".activities", name: "Activities", icon: "menu-icon fa fa-share-alt"},
                            {link: ".price_list", name: "Price List", icon: "menu-icon fa fa-th"},
                            {link: ".system", name: "System", icon: "menu-icon fa fa-gears"},
                            {link: ".tools", name: "Tools", icon: "menu-icon fa fa-wrench"}
                        ];
                    };

                    if (profile.type === "Sales") {
                        $scope.items = [
                            {link: ".dashboard", name: "Dashboard", icon: "menu-icon fa fa-tachometer"},
                            {link: ".customers", name: "Customers", icon: "menu-icon fa fa-heartbeat"},
                            {link: ".activities", name: "Activities", icon: "menu-icon fa fa-share-alt"},
                            {link: ".products", name: "Products", icon: "menu-icon fa fa-th"}
                        ];
                    };
                });
            });

            $scope.getWidth = function() {
                return window.innerWidth;
            };

            $scope.$watch($scope.getWidth, function(newValue, oldValue) {
                if (newValue >= mobileView) {
                    if (angular.isDefined($cookies.get('toggle'))) {
                        $scope.toggle = ! $cookies.get('toggle') ? false : true;
                    } else {
                        $scope.toggle = true;
                    }
                } else {
                    $scope.toggle = false;
                }
            });

            window.onresize = function() {
                $scope.$apply();
            };

            $scope.toggleSidebar = function() {
                $scope.toggle = !$scope.toggle;
                $cookies.put('toggle', $scope.toggle);
            };

            $scope.logout = function() {
                AuthService.logout();
                $state.go('landing');
            };

        }

        UserProfileCtrl.$inject = ['$state', '$scope', 'AuthService', 'AdminService', 'ProfileService', 'Upload',];

        function UserProfileCtrl($state, $scope, AuthService, AdminService, ProfileService, Upload) {
            var vm = this;
            var obj = {};
            vm.error = null;
            vm.user_profile = {};
            vm.user_profile_id = {};
            var storageRef = firebase.storage().ref();

            vm.uid = AuthService.isLoggedIn().uid;
            AdminService.getUser(vm.uid).$loaded().then(function(res) {
                vm.user_profile_id = res.profile_id;
                ProfileService.loadProfile(vm.user_profile_id).$loaded().then(function(profile){
                    vm.user_profile = profile;
                });

            });

            vm.updateUserProfile = function() {
                vm.user_profile.$save();
            }, function(error) {
                  vm.error = error;
            };

            vm.updateSignatureStatement = function() {
                ProfileService.updateSignatureStatement(vm.user_profile);
            };

            vm.updateSignatureImage = function(file, type) {
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
                var node = 'profiles/'+vm.user_profile_id+'/signature_image';
                var uploadTask = storageRef.child(node + file.name).put(file, metadata);
                uploadTask.on('state_changed', null, function(error) {
                    vm.error = error;
                }, function() {
                    obj.node = node;
                    obj.total_bytes = uploadTask.snapshot.totalBytes;
                    obj.content_type = uploadTask.snapshot.metadata.contentType;
                    obj.name = uploadTask.snapshot.metadata.name;
                    obj.url = uploadTask.snapshot.metadata.downloadURLs[0];
                    ProfileService.updateSignatureImage(obj);
                });
            };

            vm.forgotPassword = function() {
                AuthService.forgotPassword(vm.user_profile.email);
                AuthService.logout();
                $state.go('landing');
            };

            vm.newPassword = function() {
                if (vm.user_profile.new_password == vm.user_profile.confirm_password) {
                    AuthService.newPassword(vm.user_profile.new_password);
                    vm.user_profile.new_password = null;
                    vm.user_profile.confirm_password = null;
                } else {
                    console.log('Passwords Do Not Match');
                };
            };

        }

})();

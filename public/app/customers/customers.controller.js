(function() {
    'use strict';

     angular
        .module('app.customers')
        .controller('CompaniesCtrl', CompaniesCtrl)
        .controller('CompanyCtrl', CompanyCtrl)
        .controller('ContactsCtrl', ContactsCtrl)
        .controller('ContactCtrl', ContactCtrl)

        CompaniesCtrl.$inject = ['$state', '$scope', 'CompanyService'];

        function CompaniesCtrl($state, $scope, CompanyService) {
            var vm = this;
            var mobileView = 992;

            vm.editCompany = editCompany;
            vm.removeCompany = removeCompany;

            CompanyService.companies().$loaded().then(function(theData) {
                vm.gridCompanies.data = theData;
            });

            function editCompany(row) {
                $state.go('account.customers.company', {'rowEntity': row.entity});
            };

            function removeCompany(row) {
                CompanyService.removeCompany(row.entity.$id);
            };

            vm.gridCompanies = {
                showGridFooter: true,
                enableSorting: true,
                enableCellEditOnFocus: true,
                enableFiltering: true,
                columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/customers/gridTemplates/editCompany.html',
                    width: 34, enableColumnMenu: false, headerTooltip: 'Edit Company', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name:'companyName', field: 'name', enableHiding: false, enableFiltering: true, enableCellEdit: false },
                    { name:'group', field: 'group', enableHiding: false, enableCellEdit: false },
                    { name:'businessUnits', field: 'business_unit', enableHiding: false, enableCellEdit: false },
                    { name:'region', field: 'region', enableHiding: false, width: '10%', enableCellEdit: false },
                    { name:'ranking', field: 'ranking', enableHiding: false, width: '10%', enableCellEdit: false },
                    { name:'type', field: 'type', enableHiding: false, width: '10%', enableFiltering: true, enableCellEdit: false, cellClass: 'grid-align-right',
                    cellTemplate: 'app/customers/gridTemplates/type.html'},
                    { name:'dateAdded', field: 'date_added', type: 'date', width: '10%', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date' },
                    { name: ' ', field: '$id', cellTemplate:'app/customers/gridTemplates/removeCompany.html',
                    width: 35, enableSorting: false, enableFiltering: false, enableCellEdit: false, enableColumnMenu: false }
                ]
            };
        }

        CompanyCtrl.$inject = ['$state', '$scope', '$stateParams', 'CompanyService', 'ContactService', 'CustomerSetupService', 'AuthService'];

        function CompanyCtrl($state, $scope, $stateParams, CompanyService, ContactService, CustomerSetupService, AuthService) {
            var vm = this;
            var obj = {};
            vm.company_id = {};
            vm.company = {};
            vm.contact_address = {};
            vm.primary_contact = {};
            vm.primaryContact_id = {};
            vm.companyContacts = [];
            vm.contactCount = {};
            CompanyService.companies().$loaded().then(function(res){
                vm.totalCompanyCount = res.length;
            })

            CustomerSetupService.industryGroups().$loaded().then(function(res) {
                vm.industryGroups = res;
            });

            CustomerSetupService.businessUnits().$loaded().then(function(res) {
                vm.businessUnits = res;
            });

            CustomerSetupService.regions().$loaded().then(function(res) {
                vm.regions = res;
            });

            CompanyService.contacts().$loaded().then(function(res) {
                vm.contacts = res;
            });

            vm.addressess = function(id) {
                CompanyService.addresses(id).$loaded().then(function(res) {
                    vm.addresses = res;
                });
            }

            vm.address = function(aid) {
                obj = {};
                obj.aid = aid;
                if (vm.company_id != undefined)
                    obj.id = vm.company_id;
                else
                    obj.id = $stateParams.rowEntity.$id;
                CompanyService.address(obj).$loaded().then(function(res) {
                    vm.selectedPriority = res.priority;
                    vm.contact_address = res;
                });
            };

            vm.loadCompany = function(id) {
                CompanyService.company(id).$loaded().then(function(res) {
                    vm.company = res;
                    vm.companyIndex = CompanyService.index(id);
                    vm.selectedPriority = 1;
                    vm.addressess(id);
                    vm.loadCompanyContacts(id);
                    CompanyService.addresses(id).$loaded().then(function(res) {
                        vm.address(res[0].$id);
                    });
                    ContactService.contact(vm.company.primaryContact_id).$loaded().then(function(res) {
                        vm.primaryContact_id = res.$id;
                        vm.primary_contact = res;
                        vm.primary_contact.primaryCompany_id = vm.company_id;
                        vm.primary_contact.company_name = vm.company.name;
                    });
                });
            };

            vm.loadCompanyContacts = function(id){
                CompanyService.companyContacts(id).$loaded().then(function(res){
                    vm.companyContacts = [];
                    for(var i = 0; i < res.length; i++) {
                        var theRef = res[i];
                        ContactService.contact(theRef.$id).$loaded().then(function(theContact){
                            theContact.date_added = theRef.date_added;
                            vm.companyContacts.push(theContact);
                            vm.contactCount = vm.companyContacts.length;
                        });
                    };
                    vm.gridCompanyContacts.data = vm.companyContacts;
                });
            };

            if ($stateParams.rowEntity != undefined) {
                vm.company_id = $stateParams.rowEntity.$id;
                vm.loadCompany(vm.company_id);
            } else {
                vm.company_id = null;
                vm.primaryContact_id = null;
            };

            vm.addCompanyPrimaryContact = function(key) {
                vm.company.primaryContact_id = key;
                vm.company.view_status = true;
                vm.company.address_count = 1;
                CompanyService.newCompany(vm.company).then(function(key) {
                    obj = {};
                    obj.id = key;
                    obj.cnt = 1;
                    CompanyService.addAddress(obj);
                    vm.company_id = key;
                    obj.company_id = key;
                    obj.contact_id = vm.company.primaryContact_id;
                    obj.company_name = vm.company.name;
                    obj.uid = AuthService.isLoggedIn().uid;
                    CompanyService.newContactToCompany(obj);
                    vm.loadCompany(key);
                });
            }

            vm.newCompany = function() {
                obj = {};
                obj.view_status = true;

                if (vm.company.address1 !== undefined)
                    obj.address1 = vm.company.address1;
                else
                    obj.address1 = null;
                if (vm.company.address2 !== undefined)
                    obj.address2 = vm.company.address2;
                else
                    obj.address2 = null;
                if (vm.company.city !== undefined)
                    obj.city = vm.company.city;
                else
                    obj.city = null;
                if (vm.company.province !== undefined)
                    obj.province = vm.company.province;
                else
                    obj.province = null;
                if (vm.company.postal_code !== undefined)
                    obj.postal_code = vm.company.postal_code;
                else
                    obj.postal_code = null;
                if (vm.company.country !== undefined)
                    obj.country = vm.company.country;
                else
                    obj.country = null;

                if (vm.primary_contact.job_title !== undefined)
                    obj.job_title = vm.primary_contact.job_title;
                else
                    obj.job_title = null;
                if (vm.primary_contact.first_name !== undefined)
                    obj.first_name = vm.primary_contact.first_name;
                else
                    obj.first_name = null;
                if (vm.primary_contact.last_name !== undefined)
                    obj.last_name = vm.primary_contact.last_name;
                else
                    obj.last_name = null
                if (vm.primary_contact.first_name !== undefined && vm.primary_contact.last_name !== undefined)
                    obj.full_name = vm.primary_contact.first_name + ' ' + vm.primary_contact.last_name;
                else
                    obj.full_name = null
                if (vm.primary_contact.email !== undefined)
                    obj.email = vm.primary_contact.email;
                else
                    obj.email = null;
                if (vm.primary_contact.cell_phone !== undefined)
                    obj.cell_phone = vm.primary_contact.cell_phone;
                else
                    obj.cell_phone = null;
                if (vm.primary_contact.business_phone !== undefined)
                    obj.business_phone = vm.primary_contact.business_phone;
                else
                    obj.business_phone = null;

                if (obj.first_name !== null && obj.last_name) {
                    ContactService.addContact(obj).then(function(contact_id) {
                        vm.addCompanyPrimaryContact(contact_id);
                    });
                } else {
                    CompanyService.newCompany(vm.company).then(function(key) {
                        obj = {};
                        obj.id = key;
                        obj.cnt = 1;
                        CompanyService.addAddress(obj);
                        vm.company_id = key;
                    });
                }
            }, function(error) {
                vm.error = error;
            };

            vm.addAddress = function() {
                obj = {};
                obj.id = vm.company_id;
                obj.cnt = vm.company.address_count + 1;
                vm.selectedPriority = obj.cnt;
                vm.address.priority = obj.cnt;
                CompanyService.updateAddressCount(obj);
                CompanyService.addAddress(obj);
                vm.loadCompany(vm.company_id);
            }, function(error) {
                vm.error = error;
            };

            vm.removeAddress = function(id) {
                obj = {};
                obj.aid = id;
                obj.id = vm.company_id;
                obj.cnt = vm.company.address_count - 1;
                CompanyService.updateAddressCount(obj);
                CompanyService.removeAddress(obj);
                vm.loadCompany(vm.company_id);
            }, function(error) {
                vm.error = error;
            };

            vm.updateCompany = function() {
                if (vm.company_id !== null) {
                    vm.company.$save();
                }
            }, function(error) {
                vm.error = error;
            };

            vm.newContact = function() {
                obj = {};
                vm.primary_contact.view_status = true;
                vm.primary_contact.company_name = vm.company.name;
                vm.primary_contact.job_title = null;
                vm.primary_contact.first_name = vm.contact_name.substr(0, vm.contact_name.indexOf(' '));
                vm.primary_contact.last_name = vm.contact_name.substr(vm.contact_name.indexOf(' ')+1);
                vm.primary_contact.full_name = vm.primary_contact.first_name + ' ' + vm.primary_contact.last_name;
                vm.primary_contact.email = null;
                vm.primary_contact.cell_phone = null;
                vm.primary_contact.business_phone = null;
                ContactService.addContact(vm.primary_contact).then(function(key) {
                    vm.addCompanyPrimaryContact(key);
                });
            }, function(error) {
                vm.error = error;
            };

            vm.updatePrimaryContactNode = function() {
                if (vm.primaryContact_id !== null) {
                    obj = {};
                    if (vm.primary_contact.job_title !== undefined)
                        obj.job_title = vm.primary_contact.job_title;
                    else
                        obj.job_title = null;
                    if (vm.primary_contact.first_name !== undefined)
                        obj.first_name = vm.primary_contact.first_name;
                    else
                        obj.first_name = null;
                    if (vm.primary_contact.last_name !== undefined)
                        obj.last_name = vm.primary_contact.last_name;
                    else
                        obj.last_name = null;
                    if (vm.primary_contact.first_name !== undefined && vm.primary_contact.last_name !== undefined)
                        obj.full_name = vm.primary_contact.first_name + ' ' + vm.primary_contact.last_name;
                    else
                        obj.full_name = null
                    if (vm.primary_contact.last_name !== undefined)
                        obj.email = vm.primary_contact.email;
                    else
                        obj.email = null;
                    if (vm.primary_contact.cell_phone !== undefined)
                        obj.cell_phone = vm.primary_contact.cell_phone;
                    else
                        obj.cell_phone = null;
                    if (vm.primary_contact.business_questions_phone !== undefined)
                        obj.business_phone = vm.primary_contact.business_phone;
                    else
                        obj.business_phone = null;

                    if (obj.email !== null) {
                        ContactService.findEmail(obj.email).$loaded().then(function(res) {
                            if (res.length === 0)
                                vm.primary_contact.$save();
                            if (res.length > 0) {
                                obj.contact_id = res[0].$id;
                                ContactService.updatePrimaryContact(obj);
                            }
                        });
                    }
                }
            }, function(error) {
                vm.error = error;
            };

            vm.updatePrimaryContact = function() {
                obj = {};
                if (vm.company_id !== null) {
                    obj.company_id = vm.company_id;
                    obj.name = vm.company.name;
                    obj.contact_id = vm.primary_contact.$id;
                    obj.uid = AuthService.isLoggedIn().uid;
                    CompanyService.updatePrimaryContact(obj);
                    CompanyService.addContactAndCompany(obj);
                }
            }, function(error) {
                vm.error = error;
            };

            vm.updateAddress = function(id) {
                vm.address.$save();
            }, function(error) {
                vm.error = error;
            };

            vm.newContactToCompany = function() {
                obj = {};
                obj.uid = AuthService.isLoggedIn().uid;
                obj.contact_id = vm.contact.$id;
                obj.company_id = vm.company_id;
                CompanyService.contactCheck(obj).once('value').then(function(res){
                    if (res.val() === null) {
                        CompanyService.newContactToCompany(obj);
                        vm.contact = null;
                        vm.loadCompanyContacts(vm.company_id);
                    } else {
                        vm.contact_id = null;
                        console.log('Contact is already associated with this company.')
                    };
                });

            }, function(error) {
                vm.error = error;
            };

            vm.removeContactFromCompany = function(row) {
                obj = {};
                obj.contact_id = row.entity.$id;
                obj.company_id = vm.company_id;
                CompanyService.removeContactFromCompany(obj);
                vm.loadCompanyContacts(vm.company_id);
            }, function(error) {
                vm.error = error;
            };

            vm.gridCompanyContacts = {
                showGridFooter: true,
                enableSorting: true,
                columnDefs: [
                    { name:'contactName', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.first_name}} {{row.entity.last_name}}</div>',
                    enableHiding: false, enableFiltering: true, enableCellEdit: false, width: '25%' },
                    { name:'email', field: 'email', enableHiding: false, width: '20%', enableCellEdit: false },
                    { name:'officePhoneNumber', field: 'business_phone', enableHiding: false, width: '20%', enableCellEdit: false },
                    { name:'cellPhoneNumber', field: 'cell_phone', enableHiding: false, width: '20%', enableCellEdit: false },
                    { name:'dateAdded', field: 'date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date' }
                ]
            };

            vm.next = function() {
                var key = vm.companyIndex + 1;
                if (key != vm.totalCompanyCount)
                    vm.loadCompany(CompanyService.key(key));;
            }, function(error) {
                vm.error = error;
            };

            vm.back = function() {
                var key = vm.companyIndex - 1;
                if (key < 0)
                    key = 0
                vm.loadCompany(CompanyService.key(key));
            }, function(error) {
                vm.error = error;
            };

            vm.first = function() {
                vm.loadCompany(CompanyService.key(0));
            }, function(error) {
                vm.error = error;
            };

            vm.last = function() {
                vm.loadCompany(CompanyService.key(vm.totalCompanyCount - 1));
            }, function(error) {
                vm.error = error;
            };

        }

      ContactsCtrl.$inject = ['$state', '$scope', 'ContactService', 'CompanyService', 'AuthService', 'AdminService', 'ProfileService',
          'ActivityService'];

      function ContactsCtrl($state, $scope, ContactService, CompanyService, AuthService, AdminService, ProfileService, ActivityService) {
          var vm = this;
          var mobileView = 992;
          var obj = {};

          vm.uid = AuthService.isLoggedIn().uid;
          AdminService.getUser(vm.uid).$loaded().then(function(res) {
              ProfileService.loadProfile(res.profile_id).$loaded().then(function(profile){
                  vm.user_profile = profile;
              });
          });

          ContactService.contacts().$loaded().then(function(res) {
              vm.gridContacts.data = res;
          });

          vm.editContact = function editContact(row) {
              $state.go('account.customers.contact', {'rowEntity': row.entity});
          };

          vm.removeContact = function(row) {
              ContactService.removeContact(row.entity.$id);
          }, function(error) {
              vm.error = error;
          };

          vm.newActivity = function(row) {
              obj = {};
              obj.user_name = vm.user_profile.name;
              obj.uid = vm.uid;
              obj.info_status = true;
              obj.view_status = true;
              obj.current_status = 'info';
              obj.contact_id = row.entity.$id;
              if (row.entity.company_name !== undefined)
                obj.company_name = row.entity.company_name;
              if (row.entity.first_name !== undefined && row.entity.last_name !== undefined)
                  obj.contact_full_name = row.entity.first_name + ' ' + row.entity.last_name;
              if (row.entity.first_name !== undefined && row.entity.last_name === undefined)
                  obj.contact_full_name = row.entity.first_name;
                  // hard coded for phone call activity id
                  obj.activity_type_id = '-KL7EBOMXFjLnNDgW5GU';
              ActivityService.addActivity(obj).then(function(id) {
                  obj.$id = id;
                  obj.contact_id = row.entity.$id;
                  $state.go('account.activity.discovery', {'rowEntity': obj});
              });
          }, function(error) {
              vm.error = error;
          };

          vm.gridContacts = {
              showGridFooter: true,
              enableSorting: true,
              enableCellEditOnFocus: true,
              enableFiltering: true,
              columnDefs: [
                    { name: '', field: '$id', shown: false, cellTemplate: 'app/customers/gridTemplates/editContact.html',
                    width: 34, enableColumnMenu: false, headerTooltip: 'Edit Contact', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name: '  ', field: '$id', shown: false, cellTemplate: 'app/customers/gridTemplates/newActivity.html',
                    width: 34, enableColumnMenu: false, headerTooltip: 'New Activity', enableCellEdit: false, enableCellEdit: false, enableFiltering: false },
                    { name:'firstName', field: 'first_name', enableHiding: false, enableFiltering: true, width: '9%', enableCellEdit: false },
                    { name:'lastName', field: 'last_name', enableHiding: false, enableFiltering: true, width: '9%', enableCellEdit: false },
                    { name:'email', field: 'email', enableHiding: false, enableFiltering: true, width: '13%', enableCellEdit: false,
                    cellTemplate: 'app/customers/gridTemplates/email.html' },
                    { name:'company', field: 'company_name', enableHiding: false, enableFiltering: true, enableCellEdit: false },
                    { name:'businessPhone', field: 'business_phone', enableHiding: false, enableFiltering: true, width: '12%', enableCellEdit: false, cellClass: 'grid-align-right' },
                    { name:'group', field: 'group', enableHiding: false, enableCellEdit: false, width: '10%', cellClass: 'grid-align-right' },
                    { name:'ranking', field: 'ranking', enableHiding: false, enableCellEdit: false, width: '8%', cellClass: 'grid-align-right' },
                    { name:'type', field: 'type', enableHiding: false, enableFiltering: true, width: '8%', enableCellEdit: false, cellClass: 'grid-align-right',
                    cellTemplate: 'app/customers/gridTemplates/type.html'},
                    { name:'dateAdded', field: 'date_added', type: 'date', width: '10%', enableHiding: false, cellClass: 'grid-align-right',
                    enableCellEdit: false, cellFilter: 'date' },
                    { name: ' ', field: '$id', cellTemplate:'app/customers/gridTemplates/removeContact.html',
                    width: 35, enableSorting: false, enableFiltering: false, enableCellEdit: false, enableColumnMenu: false }
              ]
          };
      }

      ContactCtrl.$inject = ['$state', '$scope', '$stateParams', 'ContactService', 'CompanyService', 'ActivitySetupService', 'AuthService',
          'ContactLoadPreferences', 'ContactLoadKpis'];

      function ContactCtrl($state, $scope, $stateParams, ContactService, CompanyService, ActivitySetupService, AuthService,
          ContactLoadPreferences, ContactLoadKpis) {
          var vm = this;
          var obj = {};
          var companyObj = {};
          var cnt = {};
          vm.contact_id = {};
          vm.contact = {};
          vm.company = {};
          vm.company_id = null;
          vm.lastPreference = {};
          vm.contactPreference = {};
          vm.contactCompanies = [];
          vm.primaryCompany_id = {};
          vm.primary_company = {};
          ContactService.contacts().$loaded().then(function(res){
                vm.totalContactCount = res.length;
          });

          var storageRef = firebase.storage().ref();

          $scope.preferences = {
              selected: null,
              lists: {"P": []}
          };

          $scope.kpis = {
              selected: null,
              lists: {"K": []}
          };

          ContactService.industryGroups().$loaded().then(function(res){
              vm.groups = res;
          });

          ContactService.regions().$loaded().then(function(res){
              vm.regions = res;
          });

          ContactService.companies().$loaded().then(function(res){
              vm.companies = res;
          });

          ActivitySetupService.businessQuestions().$loaded().then(function(res) {
              vm.business_questions = res;
          });

          ActivitySetupService.solutionQuestions().$loaded().then(function(res) {
              vm.solution_questions = res;
          });

          vm.loadContactCompanies = function(id) {
              obj = {};
              var contactCompanies = [];
              ContactService.contactCompanies(id).$loaded().then(function(res) {
                   vm.gridContactCompanies.data = res;
              });
          };

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

          vm.loadDocs = function(id) {
              ContactService.contactDocs(id).$loaded().then(function(res) {
                  vm.docs = res;
              });
          };

          vm.loadNotes = function(id) {
              ContactService.notes(id).$loaded().then(function(res) {
                  vm.contact_notes = res;
              });
          };

          vm.loadContact = function(id) {
              ContactService.contact(id).$loaded().then(function(res) {
                  vm.contact = res;
                  vm.contactIndex = ContactService.index(id);
                  vm.loadContactCompanies(id);
                  vm.loadPreferences(id);
                  vm.loadKpis(id);
                  vm.loadDocs(id);
                  vm.loadNotes(id);
                  CompanyService.company(vm.contact.primaryCompany_id).$loaded().then(function(res) {
                      vm.primary_company = res;
                  });
              });
          }, function(error) {
              vm.error = error;
          };

          if ($stateParams.rowEntity != undefined) {
              vm.contact_id = $stateParams.rowEntity.$id;
              vm.loadContact(vm.contact_id);
          } else {
              vm.contact_id = null;
          };

          vm.addContact = function() {
              vm.contact.view_status = true;
              if (vm.contact.first_name !== undefined && vm.contact.last_name !== undefined)
                  vm.contact.full_name = vm.contact.first_name + ' ' + vm.contact.last_name;
              if (vm.contact.first_name !== undefined && vm.contact.last_name === undefined)
                  vm.contact.full_name = vm.contact.first_name;

              ContactService.addContact(vm.contact).then(function(id) {
                  obj = {};
                  vm.contact_id = id;

                  if (Object.keys(vm.primary_company).length !== 0) {
                      obj.contact_id = vm.contact_id;
                      obj.uid = AuthService.isLoggedIn().uid;

                      if (vm.company_id === null) {
                          obj.company_id = vm.primary_company.$id;
                          obj.company_name = vm.primary_company.name;
                      } else {
                          companyObj = {};
                          obj.company_id = vm.company_id;
                          obj.company_name = vm.company.name;

                          companyObj.company_id = vm.company_id;
                          companyObj.company_name = vm.company.name;
                          companyObj.contact_id = vm.contact_id;
                          if (vm.contact.group !== undefined)
                              companyObj.group = vm.contact.group;
                          else
                              companyObj.group = null;
                          if (vm.contact.region !== undefined)
                              companyObj.region = vm.contact.region;
                          else
                              companyObj.group = null;
                          if (vm.contact.business_unit !== undefined)
                              companyObj.business_unit = vm.contact.business_unit;
                          else
                              companyObj.business_unit = null;
                          if (vm.contact.ranking !== undefined)
                              companyObj.ranking = vm.contact.ranking;
                          else
                              companyObj.ranking = null;
                          if (vm.contact.region !== undefined)
                              companyObj.region = vm.contact.region;
                          else
                              companyObj.region = null;

                          if (vm.contact.address1 !== undefined)
                              companyObj.address1 = vm.contact.address1;
                          else
                              companyObj.address1 = null;
                          if (vm.contact.address2 !== undefined)
                              companyObj.address2 = vm.contact.address2;
                          else
                              companyObj.address2 = null;
                          if (vm.contact.city !== undefined)
                              companyObj.city = vm.contact.city;
                          else
                              companyObj.city = null;
                          if (vm.contact.province !== undefined)
                              companyObj.province = vm.contact.province;
                          else
                              companyObj.province = null;
                          if (vm.contact.postal_code !== undefined)
                              companyObj.postal_code = vm.contact.postal_code;
                          else
                              companyObj.postal_code = null;
                          if (vm.contact.country !== undefined)
                              companyObj.country = vm.contact.country;
                          else
                              companyObj.country = null;

                          CompanyService.updateCompany(companyObj);
                      }

                      ContactService.updatePrimaryCompany(obj);
                  }
                  vm.loadContact(vm.contact_id);
              });
          }, function(error) {
            vm.error = error;
          };

          vm.updateContact = function() {
              if (vm.contact_id !== null)
                  vm.contact.$save();
          }, function(error) {
              vm.error = error;
          };

          vm.updatePrimaryCompany = function() {
              obj = {};
              if (vm.contact_id !== null) {
                  obj.contact_id = vm.contact.$id;
                  obj.company_id = vm.primary_company.$id;
                  obj.company_name = vm.primary_company.name;
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
                  vm.primary_company.name = vm.company_name;
                  vm.company_id = key;
                  obj.id = key;
                  obj.cnt = 1;
                  CompanyService.addAddress(obj);
              });
          }, function(error) {
              vm.error = error;
          };

          vm.updatePreferenceNote = function(key, label) {
              obj = {};
              obj.key = key;
              obj.contact_id = vm.contact_id;
              obj.notes = vm.contact_preference.notes
              ContactService.contactUpdatePreferenceNote(obj);
          };

          vm.selectPreference = function() {
              obj = {};
              obj.contact_id = vm.contact_id;
              obj.key = $scope.preferences.selected.$id;
              ContactService.contactPreference(obj).$loaded().then(function(res) {
                  vm.contact_preference = res;
              });
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
              vm.loadPreferences(vm.contact_id);
          };

          vm.updateKpiNote = function(key, label) {
              obj = {};
              obj.key = key;
              obj.contact_id = vm.contact_id;
              obj.notes = vm.contact_kpi.notes
              ContactService.contactUpdateKpiNote(obj);
          };

          vm.selectKpi = function() {
              obj = {};
              obj.contact_id = vm.contact_id;
              obj.key = $scope.kpis.selected.$id;
              ContactService.contactKpi(obj).$loaded().then(function(res) {
                  vm.contact_kpi = res;
              });
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
              vm.loadKpis(vm.contact_id);
          };

          vm.addCompanyToContact = function() {
              obj = {};
              if (vm.company !== undefined) {
                  obj.uid = AuthService.isLoggedIn().uid;
                  obj.contact_id = vm.contact_id;
                  obj.company_id = vm.company.$id;
                  obj.name = vm.company.name;
                  ContactService.companyCheck(obj).once('value').then(function(res) {
                      if (res.val() === null) {
                          ContactService.addCompanyToContact(obj);
                          vm.company = null;
                          vm.loadContact(vm.contact_id);
                      } else {
                          vm.company = null;
                          console.log('Company is already associated with this contact.')
                      };
                  });
              }
          }, function(error) {
              vm.error = error;
          };

          vm.removeCompanyFromContact = function(row) {
              obj = {};
              obj.company_id = row.entity.primaryCompany_id;
              obj.contact_id = vm.contact_id;
              ContactService.removeCompanyFromContact(obj);
              vm.loadContactCompanies(vm.contact_id);
          }, function(error) {
              vm.error = error;
          };

          vm.addContactNote = function() {
              obj = {};
              obj.contact_id = vm.contact_id;
              obj.note = vm.note;
              obj.type = "Note";
              ContactService.addContactNote(obj);
              vm.note = null;
          }, function(error) {
              vm.error = error;
          };

          vm.gridContactCompanies = {
              showGridFooter: true,
              enableSorting: true,
              columnDefs: [
                  { name:'companyName', field: 'name', enableHiding: false, enableFiltering: true, enableCellEdit: false },
                  { name:'dateAdded', field: 'date_added', type: 'date', enableHiding: false, cellClass: 'grid-align-right',
                  enableCellEdit: false, cellFilter: 'date', width: '10%' }
               ]
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
              ContactService.updateBusinessAnswer(obj);
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
              ContactService.updateSolutionAnswer(obj);
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
                      obj.activity_id = null;
                      obj.view_status = true;
                      obj.total_bytes = uploadTask.snapshot.totalBytes;
                      obj.content_type = uploadTask.snapshot.metadata.contentType;
                      obj.name = uploadTask.snapshot.metadata.name;
                      obj.url = uploadTask.snapshot.metadata.downloadURLs[0];
                      ContactService.addDoc(obj);
                  });

              });
          };

          vm.next = function() {
              var key = vm.contactIndex + 1;
              if (key != vm.totalContactCount)
                  vm.loadContact(ContactService.key(key));

          }, function(error) {
                vm.error = error;
          };

          vm.back = function() {
              var key = vm.contactIndex - 1;
              if (key < 0)
                  key = 0;
              vm.loadContact(ContactService.key(key));

          }, function(error) {
                vm.error = error;
          };

          vm.first = function() {
                vm.loadContact(ContactService.key(0));

          }, function(error) {
                vm.error = error;
          };

          vm.last = function() {
                vm.loadContact(ContactService.key(vm.totalContactCount - 1));

          }, function(error) {
            vm.error = error;
          };

          vm.removeDoc = function(id) {
              obj = {};
              obj.contact_id = vm.contact_id;
              obj.doc_id = id;
              ContactService.removeDoc(obj);
          }


      }

})();

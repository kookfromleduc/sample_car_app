(function() {
    'use strict';

    angular
        .module('app.system')
        .factory('ProfileService', ProfileService)
        .factory('CustomerSetupService', CustomerSetupService)
        .factory('ActivitySetupService', ActivitySetupService)
        .factory('TemplateService', TemplateService)

    ProfileService.$inject = ['$firebaseObject', '$firebaseArray', 'DataService'];

    function ProfileService($firebaseObject, $firebaseArray, DataService) {

          var service = {
              profiles: profiles,
              salesProfiles: salesProfiles,
              addProfile: addProfile,
              loadProfile: loadProfile,
              updateSignatureStatement: updateSignatureStatement,
              updateSignatureImage: updateSignatureImage,
              index: index,
              key: key
          };

          return service;

          function profiles() {
              return DataService.profiles;
          }

          function salesProfiles() {
              return $firebaseArray(DataService.root.ref('profiles/').orderByChild('type').equalTo('Sales'));
          }

          function addProfile(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              return DataService.profiles.$add(obj).then(function(res){
                  return res.key;
              });
          }

          function loadProfile(id) {
              return $firebaseObject(DataService.root.ref('profiles/'+ id));
          }

          function updateSignatureStatement(obj) {
              return DataService.root.ref('profiles/' + obj.$id).update({signature_statement: obj.signature_statement, update_date: firebase.database.ServerValue.TIMESTAMP});
          }

          function updateSignatureImage(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              return DataService.root.ref(obj.node).set({name: obj.name, url: obj.url, type: obj.content_type, base64: obj.base64,
                  total_bytes: obj.total_bytes, date_added: obj.date_added});
          }

          function index(id) {
              return DataService.profiles.$indexFor(id);
          }

          function key(key) {
              return DataService.profiles.$keyAt(key);
          }

    }

    CustomerSetupService.$inject = ['$firebaseObject', 'DataService'];

    function CustomerSetupService($firebaseObject, DataService) {

          var service = {
              industryGroups: industryGroups,
              businessUnits: businessUnits,
              regions: regions,
              revenueGroups: revenueGroups,
              targetProfile: targetProfile,
              prospectProfile: prospectProfile,
              customerProfile: customerProfile,
              addNode: addNode,
              removeNode: removeNode,
              updateProfileAttributes: updateProfileAttributes,
              updateProfileObjectives: updateProfileObjectives,
          };

          return service;

          function industryGroups() {
              return DataService.industry_groups;
          }

          function businessUnits() {
              return DataService.business_units;
          }

          function regions() {
              return DataService.regions;
          }

          function revenueGroups() {
              return DataService.revenue_groups;
          }

          function targetProfile() {
              return $firebaseObject(DataService.root.ref('customer_profiles/target/'));
          }

          function prospectProfile() {
              return $firebaseObject(DataService.root.ref('customer_profiles/prospect/'));
          }

          function customerProfile() {
              return $firebaseObject(DataService.root.ref('customer_profiles/customer/'));
          }

          function updateProfileAttributes(obj) {
              DataService.root.ref('customer_profiles/'+ obj.node + '/').update({attributes: obj.attributes});
          }

          function updateProfileObjectives(obj) {
              DataService.root.ref('customer_profiles/'+ obj.node + '/').update({objectives: obj.objectives});
          }

          function addNode(obj) {
              if (obj.node === 'revenue_group')
                  return DataService.revenue_groups.$add({name: obj.name, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'industry_group')
                  return DataService.industry_groups.$add({name: obj.name, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'business_unit')
                  return DataService.business_units.$add({name: obj.name, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'region')
                  return DataService.regions.$add({name: obj.name, date_added: firebase.database.ServerValue.TIMESTAMP});
          }

          function removeNode(id, node) {
              return $firebaseObject(DataService.root.ref(node).child(id)).$remove();
          }

    }

    ActivitySetupService.$inject = ['$firebaseObject', 'DataService'];

    function ActivitySetupService($firebaseObject, DataService) {

          var service = {
              salesActivities: salesActivities,
              addPreference: addPreference,
              preferences: preferences,
              preferencesSnapShot: preferencesSnapShot,
              addKpi: addKpi,
              kpis: kpis,
              kpisSnapShot: kpisSnapShot,
              businessQuestions: businessQuestions,
              solutionQuestions: solutionQuestions,
              businessQuestionsSnapShot: businessQuestionsSnapShot,
              solutionQuestionsSnapShot: solutionQuestionsSnapShot,
              addNode: addNode,
              removeNode: removeNode,
              updateBusinessQuestion: updateBusinessQuestion,
              updateSolutionQuestion: updateSolutionQuestion
          };

          return service;

          function salesActivities() {
              return DataService.sales_activities;
          }

          function preferences() {
              return DataService.preferences;
          }

          function preferencesSnapShot() {
              return DataService.root.ref('preferences');
          }

          function addPreference(obj) {
              return DataService.preferences.$add({name: obj.name, label: obj.label, date_added: firebase.database.ServerValue.TIMESTAMP});
          }

          function kpis() {
              return DataService.kpis;
          }

          function kpisSnapShot() {
              return DataService.root.ref('kpis');
          }

          function addKpi(obj) {
              return DataService.kpis.$add({name: obj.name, label: obj.label, date_added: firebase.database.ServerValue.TIMESTAMP});
          }

          function businessQuestions() {
              return DataService.business_questions;
          }

          function businessQuestionsSnapShot() {
              return DataService.root.ref('business_questions');
          }

          function solutionQuestionsSnapShot() {
              return DataService.root.ref('solution_questions');
          }

          function solutionQuestions() {
              return DataService.solution_questions;
          }

          function businessQuestion(id) {
              return $firebaseObject(DataService.root.ref('business_questions/'+ id));
          }

          function solutionQuestion() {
              return $firebaseObject(DataService.root.ref('solution_questions/'+ id));
          }

          function updateBusinessQuestion(obj) {
              DataService.root.ref('business_questions/'+ obj.$id + '/').update({question: obj.question});
          }

          function updateSolutionQuestion(obj) {
              DataService.root.ref('solution_questions/'+ obj.$id + '/').update({question: obj.question});
          }

          function addNode(obj) {
              if (obj.node === 'sales_activity')
                  return DataService.sales_activities.$add({name: obj.name, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'business_question')
                  return DataService.business_questions.$add({name: obj.name, question: obj.question, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'solution_question')
                  return DataService.solution_questions.$add({name: obj.name, question: obj.question, date_added: firebase.database.ServerValue.TIMESTAMP});
          }

          function removeNode(id, node) {
              return $firebaseObject(DataService.root.ref(node).child(id)).$remove();
          }

    }

    TemplateService.$inject = ['$firebaseObject', '$firebaseArray', 'DataService'];

    function TemplateService($firebaseObject, $firebaseArray, DataService) {

          var service = {
              quote: quote,
              order: order,
              template_images: template_images,
              services: services,
              transportation: transportation,
              updateSubjectLine: updateSubjectLine,
              updatePreamble: updatePreamble,
              updateMarketing: updateMarketing,
              updateClosingStatement: updateClosingStatement,
              addShift: addShift,
              ratesByShift: ratesByShift,
              quoteDocs: quoteDocs,
              updateTemplateImage: updateTemplateImage,
              removeQuoteDoc: removeQuoteDoc,
              loadQuote: loadQuote,
              index: index,
              key: key,
              updateAdditionalInfo: updateAdditionalInfo,
              templateImages: templateImages,
              updateService: updateService,
              updateTransportation: updateTransportation,
              addNode: addNode,
              removeNode: removeNode
          };

          return service;

          function quote() {
              return DataService.quote;
          }

          function order() {
              return DataService.order;
          }

          function template_images() {
              return DataService.template_images;
          }

          function services() {
              return DataService.services;
          }

          function transportation() {
              return DataService.transportation;
          }

          function updateSubjectLine(obj) {
              return DataService.root.ref('quote_template/').update({subject_line: obj.subject_line, update_date: firebase.database.ServerValue.TIMESTAMP});
          }

          function updatePreamble(obj) {
              return DataService.root.ref('quote_template/').update({preamble: obj.preamble, update_date: firebase.database.ServerValue.TIMESTAMP});
          }

          function updateMarketing(obj) {
              return DataService.root.ref('quote_template/').update({marketing: obj.marketing, update_date: firebase.database.ServerValue.TIMESTAMP});
          }

          function updateClosingStatement(obj) {
              return DataService.root.ref('quote_template/').update({closing_statement: obj.closing_statement, update_date: firebase.database.ServerValue.TIMESTAMP});
          }

          function addShift(obj) {
              DataService.root.ref('quote_template/').update({update_date: firebase.database.ServerValue.TIMESTAMP});
              $firebaseArray(DataService.root.ref('quote_template/' + 'rates_by_shift')).$add(obj);
          }

          function updateTemplateImage(obj) {
              obj.date_added = firebase.database.ServerValue.TIMESTAMP;
              return DataService.root.ref(obj.node).set({name: obj.name, url: obj.url, type: obj.content_type, base64: obj.base64,
                  total_bytes: obj.total_bytes, date_added: obj.date_added});
          }

          function removeQuoteDoc(id) {
              DataService.root.ref('quote_template/'+ 'docs/'+ id).remove();
          }

          function ratesByShift() {
              return $firebaseArray(DataService.root.ref('quote_template/' + 'rates_by_shift'));
          }

          function quoteDocs() {
              return $firebaseArray(DataService.root.ref('quote_template/' + 'transportation'));
          }

          function loadQuote(id) {
              return $firebaseObject(DataService.root.ref('profiles/'+ id));
          }

          function index(id) {
              return DataService.profiles.$indexFor(id);
          }

          function key(key) {
              return DataService.profiles.$keyAt(key);
          }

          function templateImages() {
              return DataService.template_images;
          }

          function updateAdditionalInfo(obj) {
              return DataService.root.ref('order_template/').update({additional_info: obj.additional_info, update_date: firebase.database.ServerValue.TIMESTAMP});
          }

          function updateService(obj) {
              DataService.root.ref('quote_template/' + 'services/' + obj.$id + '/').update({service: obj.service});
          }

          function updateTransportation(obj) {
              DataService.root.ref('quote_template/' + 'transportation/' + obj.$id + '/').update({transportation: obj.transportation});
          }

          function addNode(obj) {
              if (obj.node === 'service')
                  $firebaseArray(DataService.root.ref('quote_template/' + 'services')).$add({service: obj.service, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'transportation')
                  $firebaseArray(DataService.root.ref('quote_template/' + 'transportation')).$add({transportation: obj.transportation, date_added: firebase.database.ServerValue.TIMESTAMP});
          }

          function removeNode(id, node) {
              return $firebaseObject(DataService.root.ref('quote_template/' + node).child(id)).$remove();
          }

    }

})();

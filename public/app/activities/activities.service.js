(function() {
    'use strict';

    angular
        .module('app.activities')
        .factory('ActivitiesService', ActivitiesService)
        .factory('ActivityService', ActivityService)

    ActivitiesService.$inject = ['$firebaseArray', 'DataService'];

    function ActivitiesService($firebaseArray, DataService) {

          var service = {
              activities: activities,
              myActivities: myActivities
          };

          return service;

          function activities() {
              return DataService.activities;
          }

          function myActivities(id) {
              return $firebaseArray(DataService.root.ref('activities/').orderByChild('uid').equalTo(id));
          }

    }

    ActivityService.$inject = ['$firebaseArray', '$firebaseObject', 'DataService'];

    function ActivityService($firebaseArray, $firebaseObject, DataService) {

          var service = {
              activityTypes: activityTypes,
              contacts: contacts,
              activity: activity,
              order: order,
              completeOrder: completeOrder,
              updateOrder: updateOrder,
              addActivity: addActivity,
              updateActivity: updateActivity,
              updateBusinessAnswer: updateBusinessAnswer,
              updateSolutionAnswer: updateSolutionAnswer,
              updateDiscovery: updateDiscovery,
              updateProposal: updateProposal,
              updateQuote: updateQuote,
              setService: setService,
              services: services,
              setTransportation: setTransportation,
              transportation: transportation,
              addActivityNode: addActivityNode,
              removeActivityNode: removeActivityNode,
              updateActivityService: updateActivityService,
              updateActivityTransportation: updateActivityTransportation,
              addRate: addRate,
              removeRate: removeRate,
              updateRate: updateRate,
              updateOrderType: updateOrderType,
              activityDocs: activityDocs,
              activityRates: activityRates,
              removeStatus: removeStatus,
              removeActivity: removeActivity,
              updateUnitNo: updateUnitNo
          };

          return service;

          function activityTypes() {
              return DataService.sales_activities;
          }

          function contacts() {
              return DataService.contacts;
          }

          function activity(id) {
              return $firebaseObject(DataService.root.ref('activities/'+ id));
          }

          function addActivity(obj) {
              obj.info_date_updated = firebase.database.ServerValue.TIMESTAMP;
              obj.info_date_added = firebase.database.ServerValue.TIMESTAMP;
              return DataService.activities.$add(obj).then(function(res){
                  return res.key;
              });
          }

          function removeActivity(obj) {
              obj.date_deleted = firebase.database.ServerValue.TIMESTAMP;
              return DataService.activities_deleted.$add(obj).then(function() {
                  DataService.root.ref('activities/' + obj.$id).remove();
              });
          }

          function updateActivity(obj) {
              obj.info_date_updated = firebase.database.ServerValue.TIMESTAMP;
              DataService.root.ref('activities/'+ obj.id + '/').update({info_date_updated: obj.info_date_updated, contact_id: obj.contact_id,
                  contact_full_name: obj.contact_full_name, company_name: obj.company_name, activity_type_id: obj.activity_type_id});
          }

          function loadActivity(id) {
              return $firebaseObject(firebase.database().ref('activities/'+ id));
          }

          function updateBusinessAnswer(obj) {
              DataService.root.ref('contacts/'+ obj.id + '/business_answers/'+ obj.name).update({answer: obj.answer, date_updated: obj.date,
                time_updated: obj.time});
          }

          function updateSolutionAnswer(obj) {
              DataService.root.ref('contacts/'+ obj.id + '/solution_answers/'+ obj.name).update({answer: obj.answer, date_updated: obj.date,
                  time_updated: obj.time});
          }

          function updateDiscovery(obj) {
              if (obj.current_status === 'info') {
                  obj.discovery_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  obj.discovery_date_added = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id + '/').update({discovery_date_added: obj.discovery_date_added,
                      discovery_date_updated: obj.discovery_date_updated, current_status: 'discovery', discovery_status: true});
              } else {
                  obj.discovery_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id + '/').update({discovery_date_updated: obj.discovery_date_updated});
              }
          }

          function removeStatus(obj) {
              if (obj.current_status === 'discovery')
                  DataService.root.ref('activities/'+ obj.id + '/').update({current_status: 'info', discovery_status: null});
              if (obj.current_status === 'proposal')
                  DataService.root.ref('activities/'+ obj.id + '/').update({current_status: 'discovery', proposal_status: null});
              if (obj.current_status === 'quote')
                  DataService.root.ref('activities/'+ obj.id + '/').update({current_status: 'proposal', quote_status: null});
              if (obj.current_status === 'order')
                  DataService.root.ref('activities/'+ obj.id + '/').update({current_status: 'quote', order_status: null});
          }

          function updateProposal(obj) {
              if (obj.current_status === 'discovery') {
                  obj.proposal_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  obj.proposal_date_added = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id + '/').update({proposal_date_added: obj.proposal_date_added,
                      proposal_date_updated: obj.proposal_date_updated, current_status: 'proposal', proposal_status: true});
              } else {
                  obj.proposal_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id + '/').update({proposal_date_updated: obj.proposal_date_updated});
              }
          }

          function updateQuote(obj) {
              if (obj.current_status === 'proposal') {
                  obj.quote_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  obj.quote_date_added = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id).update({quote_date_added: obj.quote_date_added,
                      quote_date_updated: obj.quote_date_updated, current_status: 'quote', quote_status: true});
              } else {
                  obj.quote_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id + '/').update({quote_date_updated: obj.quote_date_updated, order_type: obj.order_type});
              }
          }

          function setService(obj) {
              DataService.root.ref('activities/' + obj.id + '/services/' + obj.service_id).set({date_added: firebase.database.ServerValue.TIMESTAMP,
              service: obj.service});
          }

          function services(id) {
              return $firebaseArray(DataService.root.ref('activities/'+ id + '/services/'));
          }

          function setTransportation(obj) {
              DataService.root.ref('activities/' + obj.id + '/transportation/' + obj.transportation_id).set({date_added: firebase.database.ServerValue.TIMESTAMP,
              transportation: obj.transportation});
          }

          function transportation(id) {
              return $firebaseArray(DataService.root.ref('activities/'+ id + '/transportation/'));
          }

          function addActivityNode(obj) {
              if (obj.node === 'service')
                  $firebaseArray(DataService.root.ref('activities/' + obj.id + '/services/')).$add({service: obj.service, date_added: firebase.database.ServerValue.TIMESTAMP});
              if (obj.node === 'transportation')
                  $firebaseArray(DataService.root.ref('activities/' + obj.id + '/transportation/')).$add({transportation: obj.transportation, date_added: firebase.database.ServerValue.TIMESTAMP});
          }

          function removeActivityNode(obj) {
              return $firebaseObject(DataService.root.ref('activities/' + obj.id + '/' + obj.node).child(obj.node_id)).$remove();
          }

          function updateActivityService(obj) {
              DataService.root.ref('activities/' + obj.id + '/services/' + obj.$id + '/').update({service: obj.service});
          }

          function updateActivityTransportation(obj) {
              DataService.root.ref('activities/' + obj.id + '/transportation/' + obj.$id + '/').update({transportation: obj.transportation});
          }

          function addRate(obj) {
              DataService.root.ref('activities/'+ obj.id + '/rates/' + obj.rate_id).set({date_added: firebase.database.ServerValue.TIMESTAMP,
                name: obj.name, four_week_rate: obj.four_week_rate, week_rate: obj.week_rate, day_rate: obj.day_rate,
                description: obj.description, power_output: obj.power_output});
          }

          function removeRate(obj) {
              DataService.root.ref('activities/'+ obj.id + '/rates/' + obj.rate_id).remove();
          }

          function updateRate(obj) {
              DataService.root.ref('activities/'+ obj.id + '/rates/' + obj.rate_id).update({four_week_rate: obj.four_week_rate,
                  week_rate: obj.week_rate, day_rate: obj.day_rate});
          }

          function updateOrderType(obj) {
              DataService.root.ref('activities/'+ obj.id).update({order_type: obj.order_type});
          }

          function activityDocs(obj) {
              return $firebaseArray(DataService.root.ref('contacts/'+ obj.contact_id + '/docs/').orderByChild('activity_id').equalTo(obj.activity_id));
          }

          function activityRates(id) {
              return $firebaseArray(DataService.root.ref('activities/'+ id + '/rates/'));
          }

          function order(id) {
              return $firebaseObject(DataService.root.ref('activities/'+ id + '/order'));
          }

          function completeOrder(obj) {
              if (obj.current_status === 'quote') {
                  obj.order_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  obj.order_date_added = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id).update({order_date_added: obj.order_date_added,
                      order_date_updated: obj.order_date_updated, current_status: 'order', order_status: true});
              } else {
                  obj.order_date_updated = firebase.database.ServerValue.TIMESTAMP;
                  DataService.root.ref('activities/'+ obj.id + '/').update({order_date_updated: obj.order_date_updated});
              }
          }

          function updateOrder(obj) {
              DataService.root.ref('activities/'+ obj.id + '/order').update({on_site_contact: obj.on_site_contact,
                on_site_contact_number: obj.on_site_contact_number, location: obj.location, lsd_number: obj.lsd_number,
                delivery_date: obj.delivery_date, po_number: obj.po_number, application: obj.application,
                rig_number: obj.rig_number, reason_for_product: obj.reason_for_product, rig_company: obj.rig_company,
                rental_number: obj.rental_number, min_rental_period: obj.min_rental_period, rental_done: obj.rental_done,
                rental_start_date: obj.rental_start_date, rental_end_date: obj.rental_end_date, company_recommendation: obj.company_recommendation,
                additional_comments: obj.additional_comments});
          }

          function updateUnitNo(obj) {
              DataService.root.ref('activities/'+ obj.id + '/rates/' + obj.rate_id).update({unit_no: obj.unit_no});
          }

      }

})();

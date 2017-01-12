(function() {
    'use strict';

    angular
        .module('app.auth')
        .factory('AuthService', AuthService)

    AuthService.$inject = ['$firebaseAuth', '$firebaseArray', 'DataService'];

    function AuthService($firebaseAuth, $firebaseArray, DataService) {
        var authObject = $firebaseAuth();

          var service = {
              authObject: authObject,
              createUserEmailPassword: createUserEmailPassword,
              login: login,
              logout: logout,
              isLoggedIn: isLoggedIn,
              profileCheck: profileCheck,
              newPassword: newPassword,
              forgotPassword: forgotPassword
          };

          return service;

          function createUserEmailPassword(user) {
              return authObject.$createUserWithEmailAndPassword(user.email, user.password);
          }

          function login(user) {
              return authObject.$signInWithEmailAndPassword(user.email, user.password);
          }

          function logout() {
              authObject.$signOut();
          }

          function isLoggedIn() {
              return authObject.$getAuth();
          }

          function sendWelcomeEmail(email) {
              AdminService.emails.push({
                  emailAddress: email
              });
          }

          function profileCheck(email) {
              return $firebaseArray(DataService.root.ref('profiles').orderByChild('email').equalTo(email));
          }

          function newPassword(password) {
              authObject.$updatePassword(password).then(function(){
                  console.log("Password changed successfully!");
              }).catch(function(error) {
                  console.error("Error: ", error);
              });
          }

          function forgotPassword(email) {
              authObject.$sendPasswordResetEmail(email).then(function() {
                  console.log("Password reset email sent successfully!");
              }).catch(function(error) {
                  console.error("Error: ", error);
              });
          }

    }

})();

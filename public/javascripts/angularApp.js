"use strict";

angular.module("myApp", [ "ui.router"])
  
.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'mainCtrl'
          })
        .state('newbook', {
          url: '/newbook',
          templateUrl: '/newbook.html',
          controller: 'mainCtrl'
          })
        .state("bookz", {
          url: "/allbooks",
          templateUrl: "/allbooks.html",
          controller: "allbooksCtrl",
          resolve: {
            allbooks: ["bookFact", function(bookFact){
                return bookFact.getAllBooks();
              }
            ]
          }
        })
        .state("theBook", {
          url: "/book/{id}",
          templateUrl: "/thebook.html",
          controller: "allbooksCtrl",
          resolve: {
            thebook: ["$stateParams", "bookFact", function($stateParams,bookFact){
                return bookFact.getTheBook($stateParams.id);
              }
            ]
          }
        })
        .state('profile', {
          url: '/profile',
          templateUrl: '/profile.html',
          controller: 'profileCtrl',
          onEnter: ["$state", "auth", function($state, auth){
            if(!auth.isLoggedIn()){
              $state.go("home");
            }}],
          resolve: {
            profileData: ["profileFac","auth", function (profileFac,auth) {
              return profileFac.getuserProfile(auth.currentUser());
            }]
          }
          })
        .state('register', {
          url: '/register',
          templateUrl: '/register.html',
          controller: 'AuthCtrl',
          onEnter: ["$state", "auth", function($state, auth){
            if(auth.isLoggedIn()){
              $state.go("home");
            }
          }]
          })
          .state("login", {
            url: "/login",
            templateUrl: "/login.html",
            controller: "AuthCtrl",
            onEnter: ['$state', 'auth', function($state, auth){
            if(auth.isLoggedIn()){
                $state.go('profile');
              }
            }]
          });
      $urlRouterProvider.otherwise('home');
    }
]);
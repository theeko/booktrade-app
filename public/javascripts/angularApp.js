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
          controller: "thebookCtrl",
          resolve: {
            thebook: ["bookFact","$stateParams", function(bookFact, $stateParams){
              return bookFact.getTheBook($stateParams.id);
            }],
            traderbooks: ["profileFac","auth", function (profileFac,auth) {
              return profileFac.getUserBooks(auth.currentUser());
            }]
          }
        })
        .state('profile', {
          url: '/profile/{username}',
          templateUrl: '/profile.html',
          controller: 'profileCtrl',
          onEnter: ["$state", "auth", function($state, auth){
            if(!auth.isLoggedIn()){
              $state.go("home");
            }}],
          resolve: {
            profileData: ["profileFac","auth", function (profileFac,auth) {
              return profileFac.getuserProfile(auth.currentUser());
            }],
            userbooks: ["profileFac","auth", function (profileFac,auth) {
              return profileFac.getUserBooks(auth.currentUser());
            }],
            tradeMsgs: ["profileFac","auth", function (profileFac,auth) {
              return profileFac.getMessages(auth.currentUser());
            }],
            tradeToMsgs: ["profileFac","auth", function (profileFac,auth) {
              return profileFac.getOffers(auth.currentUser());
            }]
          }
          })
          .state('usersbooks', {
          url: '/books/{uname}',
          templateUrl: '/allbooks.html',
          controller: 'usersbooksCtrl',
          resolve: {
            theuserbooks: ["profileFac","auth","$stateParams", function (profileFac,auth,$stateParams) {
              return profileFac.theuserbooks($stateParams.uname);
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
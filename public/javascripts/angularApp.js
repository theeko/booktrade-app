"use strict";

(function(){
  var app = angular.module("myApp", [ "ui.router"]);
  
  app.config(['$stateProvider', '$urlRouterProvider', 
        function($stateProvider, $urlRouterProvider){
          $stateProvider
            .state('home', {
              url: '/home',
              templateUrl: '/home.html',
              controller: 'mainCtrl'
              // resolve: {
              //       poll: ['$stateParams', 'polls', function ($stateParams, polls) {
              //           return polls.get($stateParams.id);
              //       }]
              //   }
              })
            .state('pollresult', {
                url: '/polls/{id}',
                templateUrl: '/pollresult.html',
                controller: 'pollresultCtrl',
                resolve: {
                    poll: ['$stateParams', 'polls', function ($stateParams, polls) {
                        return polls.get($stateParams.id);
                    }]
                }
            })
            .state('profile', {
              url: '/profile',
              templateUrl: '/profile.html',
              controller: 'profileCtrl',
              onEnter: ["$state", "auth", "polls", function($state, auth, polls){
                if(!auth.isLoggedIn()){
                  $state.go("home");
                }}],
              resolve: {
                pollPromise: ['polls', 'auth', function (polls, auth) {
                    return polls.authorsPolls(auth.currentUser());
                  }]}
              })
              .state('polls', {
                url: '/polls',
                templateUrl: '/polls.html',
                controller: 'pollCtrl',
                resolve: {
                  pollsResolve: ["polls",function(polls){
                    return polls.getAll();
                  }]},
                  poll: ['$stateParams', 'polls', function ($stateParams, polls) {
                        return polls.get($stateParams.id);
                    }]
              })
            .state('newpoll', {
                url: '/newpoll',
                templateUrl: '/newpoll.html',
                controller: 'newpollCtrl',
                onEnter: ["$state", "auth", function($state, auth){
                if(!auth.isLoggedIn()){
                  $state.go("home");
                }}]
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
  
  app.controller("pollCtrl", ["polls","auth","$scope", function(polls, auth, $scope){
      $scope.polls = polls.polls;
      
      $scope.upvote= function(poll, pollid,index){
        if(!auth.isLoggedIn()){ return; }
        polls.upvote(poll, pollid,index);
        
      };
  }]);
  
  app.controller("profileCtrl", ["polls","auth","$scope", "poll", function(polls, auth, $scope, poll){
      $scope.currentUser = auth.currentUser();
      $scope.polls = polls.polls;
      $scope.poll = poll
      $scope.deletePoll = function(id, poll){
        if($scope.currentUser == poll.author){
        polls.delete(id);
         window.location.href = "#profile";
        }
      };
      $scope.upvote= function(poll, pollid,index){
        if(!auth.isLoggedIn()){ return; }
        polls.upvote(poll, pollid,index);
        
      };
      $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
  $scope.data = [300, 500, 100, 40, 120];
  }]);
  
  app.controller("mainCtrl", ["$scope", "polls", "auth", function($scope, polls, auth){
    $scope.polls = polls.polls;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.addPolls = function(){
      if($scope.title == "") {  return; }
      polls.create({
         question: $scope.question, 
         choices: [$scope.choice]
      });
      $scope.question = "";
      $scope.choice = "";
    };
    
  }]);
  
  app.controller("profileCtrl", ["polls","auth","$scope", function(polls, auth, $scope){
      $scope.currentUser = auth.currentUser();
      $scope.polls = polls.polls;
      $scope.deletePoll = function(id, poll){
        if($scope.currentUser == poll.author){
        polls.delete(id);
         window.location.href = "#profile";
        }
      };
      $scope.upvote= function(poll, pollid,index){
        if(!auth.isLoggedIn()){ return; }
        polls.upvote(poll, pollid,index);
        
      };
      
  }]);
  
  app.controller("pollresultCtrl", ["$scope", "polls", "auth", "poll", function($scope, polls, auth, poll){
    
    
      $scope.poll = poll;
    $scope.labels = [];
    $scope.data = [];  
    
      for(var i =0; i<poll.data[0].choices.length; i++){
        $scope.labels.push(poll.data[0].choices[i].option);
        $scope.data.push(poll.data[0].choices[i].votes);
      }
  
  }]);
  
  app.factory("polls", ["$http", "auth",function($http, auth){
    var o = { polls: [] };
    
    o.getAll = function(){
      return $http.get("/polls").success(function(data){
        angular.copy(data, o.polls);
      });
    };
    
    o.upvote = function(poll, pollid, index){
      return $http.put('/polls/' + pollid + "/" + index, null, {
          headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
        poll.choices[index].votes +=1;
        // window.location.href = "#polls";
      });
    };
    
    o.authorsPolls = function (username) {
          return $http.get('/polls/author/' + username).success(function (data) {
              angular.copy(data, o.polls);
          });
      };
    
    o.create = function(poll){
      return $http.post('/polls', poll, {
          headers: {Authorization: 'Bearer '+auth.getToken()}
      }).success(function(data){
        o.polls.push(data);
         window.location.href = "#profile"
      });
    };
    
     o.delete = function(id) {
          return $http.delete('/polls/' + id, null, {
              headers: {Authorization: 'Bearer ' + auth.getToken()}
          });
      };
    
    o.get = function (id) {
      return $http.get("/polls/" + id).success(function(res){
        return res.data;
      }).error(function(err){console.log(err) });
    };
    
    return o;
  }]);
  
  app.factory("auth", ["$http", '$window', function($http, $window){
    var auth = {};
    
    auth.saveToken = function(token){
      $window.localStorage["mean-vote-token"] = token;
    };
    
    auth.getToken = function () {
      return $window.localStorage["mean-vote-token"];
    };
    
    auth.isLoggedIn = function(){
      var token = auth.getToken();
    
      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
    
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    
    auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
    
        return payload.username;
      }
    };
    
    auth.register = function(user){
      return $http.post('/register', user).success(function(data){
        auth.saveToken(data.token);
      });
    };
    
    auth.logIn = function(user){
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    };
    
    auth.logOut = function(){
      $window.localStorage.removeItem('mean-vote-token');
    };
    
    return auth;
  }]);
  
  app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){
      $scope.user = {};
    
      $scope.register = function(){
        auth.register($scope.user).error(function(error){
          $scope.error = error;
        }).then(function(){
          $state.go('home');
        });
    };
  
    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };
  }]);
  
  app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
      $scope.isLoggedIn = auth.isLoggedIn;
      $scope.currentUser = auth.currentUser;
      $scope.logOut = auth.logOut;
  }]);
  
  app.controller('newpollCtrl', [
    '$scope',
    'auth',
    "polls",
    function($scope, auth,polls){
      $scope.polls = polls.polls;
      var choices = 3;
      $scope.choices = [
        { choice: $scope.choice1, votes: 0 },
        { choice: $scope.choice1, votes: 0 }
        ]
      
      $scope.addChoice = function(){
        var newcho = "choice" + choices;
        $scope.error = "";
        $scope.choices.push({ choice: $scope.newcho, votes: 0});
        
        choices +=1;
      };
      
      $scope.addPoll = function(){
        if(!$scope.question && $scope.question == "") {  $scope.error = "Need a question"; return; }
        if(!auth.isLoggedIn()) {  $scope.error = "You must log in"; return; }
        polls.create({
           question: $scope.question, 
           choices: $scope.choices
        });
        $scope.error = "";
      };
  }]);
  
})();
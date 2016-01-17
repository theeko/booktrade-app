angular.module("myApp").factory("bookFact", ["$http", "auth",function($http, auth){
var o = { books: [] };
  o.createBook = function(bookdata){
    $http.post("/newbook", bookdata, {
      headers: { Authorization: "Bearer " + auth.getToken() }
    }).success(function (data) {
      o.books.push(data);
    });
  };
  
  o.getAllBooks = function(){
    return $http.get("/allbooks").success(function(data){
     o.books = data;
    });
  };
  
  o.deleteBook = function(id){
    return $http.delete("/deletebook/" + id,null,{
      headers: {Authorization: 'Bearer ' + auth.getToken() }
    }).success(function(data){
      var ind = o.books.indexOf(data);
      return o.books.splice(ind,1);
    });
  };

return o;
}]);

angular.module("myApp").factory("profileFac",["auth","$http", function(auth,$http){
 var x = { profile: [] };
 
  x.getuserProfile = function(username) {
    return $http.get("/userprofile/" + username).success(function(data) {
        return x.profile = data;
    });
  };
  
  x.updateProfile = function (profiledata) {
    $http.put("/updateprofile/" + auth.currentUser(), profiledata,{
      headers: {Authorization: 'Bearer ' + auth.getToken() }
    }).success(function(data){
       x.profile = data;
       window.location.reload();
    });
  };
  
  return x; 
}]);

angular.module("myApp").factory("auth", ["$http", '$window', function($http, $window){
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
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
  
  o.getuserProfile = function(username) {
    $http.get("/userprofile/" + username).success(function(data) {
        return data;
    });
  };
  
  o.updateProfile = function (profiledata) {
   $http.put("/updateprofile", profiledata,{
      headers: {Authorization: 'Bearer ' + auth.getToken() }
    }).success(function(data){
      return data;
    });
  };

return o;
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
angular.module("myApp").controller("profileCtrl", [
  "auth","$scope","profileData","bookFact",function( auth, $scope,profileData,bookFact){
    
  $scope.currentUser = auth.currentUser();
  $scope.profileData = profileData;
  $scope.updateProfile = function () {
    bookFact.updateProfile($scope.currentUser);
  };
}]);

angular.module("myApp").controller("mainCtrl", ["$scope", "bookFact", "auth", function($scope, bookFact, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.createNewBook = function(){
    if(!$scope.isLoggedIn){ $scope.msg = "Must loging for creating a book"; return; }
    if($scope.booktitle && $scope.desc  && $scope.imgurl ){
      bookFact.createBook({title: $scope.booktitle,imgurl: $scope.imgurl, desc: $scope.desc});
      $scope.booktitle = "";
      $scope.imgurl = "";
      $scope.desc = "";
      $scope.msg = "New book created";
      setTimeout(function () {
        $scope.msg = "";
        window.location.reload();
      },2000);
    } else {
      { $scope.msg = "Fill all fields"; return; }
    }
  };

}]);

angular.module("myApp").controller("booksCtrl", ["auth", "$scope", function (auth, $scope) {
  $scope.currentUser = auth.currentUser;
  
}]);

angular.module("myApp").controller("allbooksCtrl", ["auth", "$scope","bookFact", function (auth, $scope, bookFact) {
  $scope.books = bookFact.books;
  $scope.deleteBook = function(id){
    bookFact.deleteBook(id);
  }
}]);
  
angular.module("myApp").controller('AuthCtrl', [
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

angular.module("myApp").controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);
  
angular.module("myApp").controller("profileCtrl", [
  "auth","$scope","profileFac","profileData","userbooks","bookFact","tradeMsgs","tradeToMsgs",
  function( auth, $scope,profileFac,profileData,userbooks,bookFact,tradeMsgs, tradeToMsgs){
  $scope.tradeMsgs = tradeMsgs.data;
  $scope.tradeToMsgs = tradeToMsgs.data;
  $scope.message = "";
  $scope.books = userbooks.data;
  $scope.currentUser = auth.currentUser();
  
  if(!!profileData.data){
    $scope.profileData = profileData.data;
    $scope.fullname = $scope.profileData.fullname;
    $scope.country = $scope.profileData.country;
    $scope.state = $scope.profileData.state;
  }
  
  
  $scope.dltMsg = function(msg){
    console.log("dlt msg func");
    console.log(msg._id);
    profileFac.deleteMessages(msg._id);
  };
  
  $scope.acceptTrade = function(msg){
    console.log(msg);
    profileFac.accepttrade(msg);
    profileFac.deleteMessages(msg._id);
  };
  
  $scope.updateProfile = function() {
    if($scope.country && $scope.fullname && $scope.state){
      profileFac.updateProfile({username: $scope.currentUser, country: $scope.country, state: $scope.state, fullname: $scope.fullname});
    } else {
      return;
    }
  };
  
  $scope.deleteUserBook = function(id){
    bookFact.deleteBook(id);
  };
  
}]);

angular.module("myApp").controller("usersbooksCtrl", [ "$scope", "profileFac","theuserbooks", function($scope, profileFac,theuserbooks){
 $scope.books =  theuserbooks.data;
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
angular.module("myApp").controller("thebookCtrl",["auth", "$scope", "thebook","traderbooks","bookFact",
function (auth, $scope, thebook,traderbooks,bookFact) {
  $scope.msg = "";
  $scope.book = thebook.data[0];
  $scope.traderbooks = traderbooks.data;
  $scope.currentUser = auth.currentUser();
  
  $scope.bookTrade = function () {
    if(!$scope.bookToTrade) { $scope.msg = "Select a book for offering"; }
    else if(!$scope.bookToTrade._id){ $scope.msg = "not enoguh info"; return; } else {
    bookFact.tradeBook({
      purposerBook: $scope.bookToTrade.title,
      purposedBook: $scope.book.title,
      purposerBookId: $scope.bookToTrade._id, 
      purposedBookId: $scope.book._id,
      messageTxt: $scope.tradeMessage,
      purposer: auth.currentUser(),
      purposedTo: $scope.book.owner
    });
    $scope.msg = "offer message sent";
    }
  };
}]);

angular.module("myApp").controller("booksCtrl", ["auth", "$scope","thebook", function (auth, $scope,thebook) {
  $scope.currentUser = auth.currentUser;
  $scope.book = thebook;
}]);

angular.module("myApp").controller("allbooksCtrl", ["auth", "$scope","bookFact", function (auth, $scope, bookFact) {
  $scope.books = bookFact.books;
  $scope.currentUser = auth.currentUser();
  $scope.tradePurposal = function (book) {
    if(!!$scope.currentUser){
      var landingUrl = "http://" + window.location.host + "#/book/" + book._id;
      window.location.href = landingUrl;
    } else { 
      window.location.href = "#login"
    }
  };
  $scope.deleteBook = function(id){
    bookFact.deleteBook(id);
  };
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
  $scope.currentUser = auth.currentUser();
  $scope.logOut = auth.logOut;
}]);
  
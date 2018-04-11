myApp.controller('TestingController', function(UserService, $scope, $modal, $log, $mdDialog) {
  console.log('TestingController created');
  var vm = this;
  vm.userService = UserService;

vm.testingVar = "TEST SUCCESS";

vm.test = function(){
  console.log('testVar is:', vm.testVar);
}

vm.apiSearchInstant = function(){
  console.log('searching text:', vm.apiSearchText);
}

});

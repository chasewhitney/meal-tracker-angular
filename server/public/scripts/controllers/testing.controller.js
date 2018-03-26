myApp.controller('TestingController', function(UserService) {
  console.log('TestingController created');
  var vm = this;
  vm.userService = UserService;
});

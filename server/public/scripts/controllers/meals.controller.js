myApp.controller('MealsController', function(UserService) {
  console.log('MealsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.goals = vm.userObject.goals;



});

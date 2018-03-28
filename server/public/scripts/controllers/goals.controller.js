myApp.controller('GoalsController', function(UserService, $http) {
  console.log('GoalsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  getGoals = function(){
    $http.get('/goals').then(function(response){
      console.log('response:', response);
    });
  };

  getGoals();
});

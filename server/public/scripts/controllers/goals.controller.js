myApp.controller('GoalsController', function(UserService, $http, $location) {
  console.log('GoalsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;


  // Gets user's nutritional goals
  getGoals = function(){
    $http.get('/goals').then(function(response){
      console.log('goals:', response.data[0]);
      vm.goals = response.data[0];
    });
  };

  vm.editGoals = function(){
    console.log('in editGoals');
    $location.path('/editGoals');
  };

  vm.saveEdit = function(){
    console.log('saving edit, sending goals:', vm.goals);
    $http.put('/goals', {data: vm.goals}).then(function(response){
      $location.path('/goals');
    });
  };

  vm.cancelEdit = function(){
    console.log('canceling edit');
    $location.path('/goals');
  };

  getGoals();
});

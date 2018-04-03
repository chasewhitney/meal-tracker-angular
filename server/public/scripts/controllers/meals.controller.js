myApp.controller('MealsController', function(UserService, $http) {
  console.log('MealsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;


  vm.createMealEntry = function(name, servings){
    console.log('in createMealEntry with vm.mealToEnter:', vm.mealToEnter);
    for (var key in vm.mealToEnter) {
      vm.mealToEnter[key] *= servings;
    }
    vm.mealToEnter.name = name;
    vm.mealToEnter.servings = servings;
    console.log('in createMealEntry sending vm.mealToEnter:', vm.mealToEnter);
    $http.post('/meals/createEntry', vm.mealToEnter).then(function(response){
      console.log('got response from PUT /meals/createEntry');
      vm.mealToEnter = {};
    });
  };

  getGoals = function(){
    $http.get('/goals').then(function(response){
      vm.goals = response.data[0];
    });
  };

  getGoals();



});

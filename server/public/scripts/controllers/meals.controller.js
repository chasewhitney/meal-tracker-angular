myApp.controller('MealsController', function(UserService, $http, $mdDialog, $mdPanel) {
  console.log('MealsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.view = 'views/partials/mealsDefault.html';

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
      getTodayProgress();
    });
  };

  vm.setView = function(view){
    vm.view = view;
  };

  getGoals = function(){
    $http.get('/goals').then(function(response){
      vm.goals = response.data[0];
    });
  };

  getTodayProgress = function(){
    $http.get('/meals/getTodayProgress').then(function(response){
      vm.today = response.data;
      console.log('vm.today is:', vm.today);
      calcDailyTotal(vm.today)
    });
  };

  calcDailyTotal = function(today){
    console.log('calculating totals');
    vm.todayTotal = angular.copy(today[0]);
    for (var i = 1; i < today.length; i++) {
      for (var key in today[i]) {
        var b = today[i];
        vm.todayTotal[key] += b[key];
      }
    }
  };

  getGoals();
  getTodayProgress();



});

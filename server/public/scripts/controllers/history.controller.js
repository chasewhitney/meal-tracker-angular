myApp.controller('HistoryController', function(UserService, MealsService, $http, $mdDialog, $mdPanel, $scope, $modal, $log) {
  console.log('HistoryController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.ms = MealsService;

  getGoals();

   function calcDailyTotal(today){
    console.log('calculating totals');
    vm.todayTotal = angular.copy(today[0]);
    for (var i = 1; i < today.length; i++) {
      for (var key in today[i]) {
        var b = today[i];
        vm.todayTotal[key] += b[key];
      }
    }
  }

  function getGoals(){
    $http.get('/goals').then(function(response){
      vm.goals = response.data[0];
    });
  }


  // Gets full history
  vm.getFullHistory = function(){
    $http.get('/meals/fullHistory').then(function(response){
      console.log('fullHistory response data is:', response.data);
      var data = response.data;
      vm.mealHistory = {};
      // Turn history into an object where key is the date and the value is an array of entries pertaining to that date
      data.forEach((v, i) =>( vm.mealHistory[v.date] ? (vm.mealHistory[v.date].push(v)) : (vm.mealHistory[v.date] = [v])));
      console.log('vm.mealHistory is:', vm.mealHistory);
    });

  };


  //// TEST FUNCTION ////
  vm.test = function(){
    console.log('in test');
  };

  vm.getFullHistory();
});

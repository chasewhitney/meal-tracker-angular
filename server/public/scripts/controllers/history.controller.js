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
      vm.fullHistory = [];
      // Turn history into an object where key is the date and the value is an array of entries pertaining to that date
      // data.forEach((v, i) =>( vm.mealHistory[v.date] ? (vm.mealHistory[v.date].push(v)) : (vm.mealHistory[v.date] = [v])));
      data.forEach((v, i) => doThing(v));
      var totalsToCalc = ["fat", "carbohydrates", "fiber", "sodium", "calories", "protein", "sugar"];
      vm.fullHistory.forEach((v,i) => calcTotals(v, totalsToCalc));
      console.log('vm.fullHistory is:', vm.fullHistory);
    });
  };

  function doThing(v){
    var index = findWithProp(vm.fullHistory, "date", v.date); //arr, prop, val

    if(index == -1){
      vm.fullHistory.push({date: v.date, entries:[v]});
    } else {
      vm.fullHistory[index].entries.push(v);
    }
    // console.log(v);

  }

// fullHistory = [
// {date:date , totals: {}, entries:[]}, daily object, daily object, ...
// ]


//// from meal controller, unchanged
function calcTotals(day, nute){
  console.log('in calcTotals with:', day);
  console.log('nutes:', nute);
  console.log('day.entries:', day.entries);
  day.totals = {};
  var dt = day.totals;
  day.entries.sum = function (prop) {
    var total = 0;
    for ( let i = 0; i < this.length; i++ ) {
        total += this[i][prop];
    }
    return total;
  };
  nute.forEach((v,i)=>{
    dt[v] = day.entries.sum(v);
  });
  dt.netCarbs = dt.carbohydrates - dt.fiber;

 // day.totals = {};
 // vm.todayTotal = angular.copy(today[0]);
 // for (var i = 1; i < today.length; i++) {
 //   for (var key in today[i]) {
 //     var b = today[i];
 //     vm.todayTotal[key] += b[key];
 //   }
 // }
}

//// from riotapi, unchanged
function findWithProp(array, property, value) {
  for(var i = 0; i < array.length; i++) {
      if(array[i][property] === value) {
          return i;
      }
  }
  return -1;
}

  //// TEST FUNCTION ////
  vm.test = function(){
    console.log('in test');
  };

  vm.getFullHistory();
});

myApp.controller('HistoryController', function(UserService, MealsService, $http, $mdDialog, $mdPanel, $scope, $modal, $log) {
  console.log('HistoryController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.ms = MealsService;

  getGoals();

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
      data.forEach((v, i) => sortByDate(v));  // Turn history into an object where key is the date and the value is an array of entries pertaining to that date
      var totalsToCalc = ["fat", "carbohydrates", "fiber", "sodium", "calories", "protein", "sugar"];
      vm.fullHistory.forEach((v,i) => calcTotals(v, totalsToCalc));
      console.log('vm.fullHistory is:', vm.fullHistory);
    });
  };

  vm.dateClicked = function(day){
    console.log('in dateClicked with:', day);
    vm.day = day;
  }

  // Sorts history by date
  function sortByDate(v){
    var index = findWithProp(vm.fullHistory, "date", v.date); //arr, prop, val
    if(index == -1){
      vm.fullHistory.push({date: v.date, entries:[v]});
    } else {
      vm.fullHistory[index].entries.push(v);
    }
  }

//// Calculates daily nutrient totals
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
}

// Returns index where array[index][property] = value, or -1;
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

myApp.controller('MealsController', function(UserService, MealsService, $http, $mdDialog, $mdPanel, $scope, $modal, $log) {
  console.log('MealsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.ms = MealsService;
vm.disabled = "disabled";
  vm.createMealEntry = function(name, servingSize, servings, meal){
    mealToEnter = meal;
    for (var key in mealToEnter) {
      mealToEnter[key] *= servings;
    }
    mealToEnter.name = name;
    mealToEnter.servingSize = servingSize;
    mealToEnter.servings = servings;
    console.log('in createMealEntry sending mealToEnter:', mealToEnter);
    $http.post('/meals/createEntry', mealToEnter).then(function(response){
      console.log('got response from PUT /meals/createEntry');
      getTodayProgress();
    });
  };

  vm.saveToFavorites = function(item){
    console.log('in saveToFavorites with:', item);
      var mealToFavorite = {};
      mealToFavorite.calories = item.calories;
      mealToFavorite.carbohydrates = item.carbohydrates;
      mealToFavorite.fat = item.fat;
      mealToFavorite.fiber = item.fiber;
      mealToFavorite.name = item.name;
      mealToFavorite.protein = item.protein;
      mealToFavorite.sodium = item.sodium;
      mealToFavorite.sugar = item.sugar;
      mealToFavorite.servingSize = item.servingSize;
    console.log('in saveToFavorites with:', mealToFavorite);
    $http.post('/meals/addFavorite', mealToFavorite).then(function(response){
      console.log('got response from PUT /meals/createEntry');
      ///// ADD CONFIRMATION DIALOG /////
    });
  };


  getFavorites = function(){
    $http.get('/meals/getFavorites').then(function(response){
      console.log('getFavorites response data is:', response.data);
      vm.favorites = response.data;
      for (var i = 0; i < vm.favorites.length; i++) {
        vm.favorites[i].servings = 1;
      }
    });
  };

  getGoals = function(){
    $http.get('/goals').then(function(response){
      vm.goals = response.data[0];
    });
  };


  // Gets meal history for today
  getTodayProgress = function(){
    $http.get('/meals/getTodayProgress').then(function(response){
      vm.today = response.data;
      console.log('vm.today is:', vm.today);
      calcDailyTotal(vm.today);
      calcCaloricComposition(vm.today);
    });
  };

  // Gets history for specific date ///UNUSED SO FAR///
  vm.getHistoricalDaily = function(){

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

  calcCaloricComposition = function(today){
    console.log('calculation caloric compositions');
    for (var i = 0; i < today.length; i++) {
      today[i].fatPercent = ((9 * today[i].fat) / today[i].calories) * 100;
      today[i].proteinPercent = ((4 * today[i].protein) / today[i].calories) * 100;
      today[i].carbPercent = 100 - today[i].fatPercent - today[i].proteinPercent;
      console.log('F,P,C:',today[i].fatPercent,today[i].proteinPercent,today[i].carbPercent);
    }
  };

  getGoals();
  getTodayProgress();
  getFavorites();

  // $scope.status = '  ';
  var customFullscreen = false;

  vm.addEntryModal = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/partials/addMealTemplate.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: customFullscreen // Only for -xs, -sm breakpoints.
    })
  };

  vm.clickFavoriteModal = function(ev, favObject) {
    console.log('favorite clicked:', favObject);
    vm.ms.favObject = favObject;

    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/partials/addFromFavorites.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
  };

  function DialogController(MealsService, $scope, $mdDialog) {
    $scope.favObject = MealsService.favObject;
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.createEntry = function(name, servingSize, servings, meal) {
      console.log('name, size, servings:', name, servingSize, servings, meal);
      vm.createMealEntry(name, servingSize, servings, meal);
      $mdDialog.hide();
    };

    $scope.createEntryFavorite = function(name, servingSize, servings, meal) {
      console.log('name, size, servings:', name, servingSize, servings, meal);
      vm.createMealEntry(name, servingSize, servings, meal);
      var favMeal = meal;
      favMeal.name = name;
      favMeal.servingSize = servingSize;
      vm.saveToFavorites(favMeal);
      $mdDialog.hide();
    };

    $scope.addEntry = function(favObj){
      var favToEnter = {};
      favToEnter.servings = favObj.servings;
      favToEnter.name = favObj.name;
      favToEnter.servingSize = favObj.servingSize;
      favToEnter.calories = favObj.calories * favObj.servings;
      favToEnter.carbohydrates = favObj.carbohydrates * favObj.servings;
      favToEnter.fat = favObj.fat * favObj.servings;
      favToEnter.fiber = favObj.fiber * favObj.servings;
      favToEnter.protein = favObj.protein * favObj.servings;
      favToEnter.sodium = favObj.sodium * favObj.servings;
      favToEnter.sugar = favObj.sugar * favObj.servings;
      favToEnter.addedFromFavorites = true;

      $http.post('/meals/createEntry', favToEnter).then(function(response){
        console.log('got response from PUT /meals/createEntry');
        $mdDialog.hide();
        getTodayProgress();
      });
    };

  }
  // BEGIN SELECT MENU



      vm.openMenu = function($mdMenu, ev, item) {
        console.log('in openMenu(), item is:', item);
        $mdMenu.open(ev);
        vm.menuItem = item;
        console.log('vm.menuItem is:', vm.menuItem);
      };

      vm.test = function(){
        console.log('in test function with item:', vm.menuItem);
      }




});

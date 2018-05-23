myApp.controller('MealsController', function(UserService, MealsService, $http, $mdDialog, $mdPanel, $scope, $modal, $log) {
  console.log('MealsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.ms = MealsService;

  getGoals();
  getTodayProgress();
  getFavorites();

   function calcCaloricComposition(today){
    console.log('calculation caloric compositions');
    for (var i = 0; i < today.length; i++) {
      today[i].fatPercent = ((9 * today[i].fat) / today[i].calories) * 100;
      today[i].proteinPercent = ((4 * today[i].protein) / today[i].calories) * 100;
      today[i].carbPercent = 100 - today[i].fatPercent - today[i].proteinPercent;
      console.log('F,P,C:',today[i].fatPercent,today[i].proteinPercent,today[i].carbPercent);
    }
  }

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

  function editFavoriteModal(ev) {
    console.log('in editFavoriteModal editing:', vm.ms.favObject);
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/partials/editFavorite.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    });
  }

  function getFavorites(){
    $http.get('/meals/getFavorites').then(function(response){
      console.log('getFavorites response data is:', response.data);
      vm.favorites = response.data;
      for (var i = 0; i < vm.favorites.length; i++) {
        vm.favorites[i].servings = 1;
      }
    });
  }

  function getGoals(){
    $http.get('/goals').then(function(response){
      vm.goals = response.data[0];
    });
  }

  // Gets meal history for today
  function getTodayProgress(){
    $http.get('/meals/getTodayProgress').then(function(response){
      vm.today = response.data;
      console.log('vm.today is:', vm.today);
      calcDailyTotal(vm.today);
      calcCaloricComposition(vm.today);
    });
  }

  vm.addEntryModal = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/partials/addMealTemplate.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
    });
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
    });
  };

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

  vm.deleteEntry = function(entry){
    $http.delete('/meals/deleteEntry/' + entry._id).then(function(response){
      console.log('Entry deleted.');
      getTodayProgress();
      $mdDialog.hide();
    });
  };

  vm.editEntry = function(ev, entry){
    vm.ms.entryToEdit = entry;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: '/views/partials/editEntry.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
    });
  };

  // Gets history for specific date ///UNUSED SO FAR/// NO ROUTE SERVER-SIDE
  vm.getHistoricalDaily = function(){
    $http.get('/meals/searchHistory').then(function(response){
      console.log('searchHistory response data is:', response.data);
      var data = response.data;
      var histObj = {};

      // Turn history into an object where key is the date and the value is an array of entries pertaining to that date
      data.forEach((v, i) =>( histObj[v.date] ? (histObj[v.date].push(v)) : (histObj[v.date] = [v])));
      console.log('histObj is:', histObj);
    });

  };

  // Run when user enters text into the API search dropdown
  vm.instantSearch = function(toQuery){
    console.log("in instantSearch with:", toQuery);
    vm.instantData ={};
    if (toQuery.length > 2) {
      var config = {params: {searchQuery: toQuery,}};
      $http.get('api/instant', config).then(function(response){
        console.log('Response from api/instant GET');
        vm.instantData = response.data;
        console.log('response:', response);
        console.log('vm.instantData:', vm.instantData);
      });
    }
  };

  vm.openMenu = function($mdMenu, ev, item) {
    console.log('in openMenu(), item is:', item);
    $mdMenu.open(ev);
    vm.menuItem = item;
    console.log('vm.menuItem is:', vm.menuItem);
  };

  vm.saveToFavorites = function(item){
    console.log('in saveToFavorites with:', item);
    var mealToFavorite = {};
    mealToFavorite.calories = item.calories / item.servings;
    mealToFavorite.carbohydrates = item.carbohydrates / item.servings;
    mealToFavorite.fat = item.fat / item.servings;
    mealToFavorite.fiber = item.fiber / item.servings;
    mealToFavorite.name = item.name;
    mealToFavorite.protein = item.protein / item.servings;
    mealToFavorite.sodium = item.sodium / item.servings;
    mealToFavorite.sugar = item.sugar / item.servings;
    mealToFavorite.servingSize = item.servingSize;
    console.log('in saveToFavorites with:', mealToFavorite);
    $http.post('/meals/addFavorite', mealToFavorite).then(function(response){
      console.log('got response from PUT /meals/createEntry');
      getFavorites();
      ///// ADD CONFIRMATION DIALOG /////
    });
  };

  // Run when a "branded" food item is selected from API search dropdown
  vm.selectBranded = function(ev, item){
    console.log('selected branded:', item.nix_item_id);
    var config = {params:{toQuery:item.nix_item_id}};
    $http.get('/api/branded', config).then(function(response){
      console.log('got response');
      var data = response.data.foods[0];
      console.log('data:', data);
      vm.ms.apiFoodObject = {};

      vm.ms.apiFoodObject.name = data.food_name;
      vm.ms.apiFoodObject.servingSize = data.serving_qty + data.serving_unit;
      vm.ms.apiFoodObject.calories = parseInt(data.nf_calories);
      vm.ms.apiFoodObject.fat = parseInt(data.nf_total_fat);
      vm.ms.apiFoodObject.carbohydrates = parseInt(data.nf_total_carbohydrate);
      vm.ms.apiFoodObject.fiber = parseInt(data.nf_dietary_fiber);
      vm.ms.apiFoodObject.sugar = parseInt(data.nf_sugars);
      vm.ms.apiFoodObject.protein = parseInt(data.nf_protein);
      vm.ms.apiFoodObject.sodium = parseInt(data.nf_sodium);

      vm.apiSearchText = '';
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/views/partials/addFromCommon.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    });
  };

  // Run when a "common" food item is selected from API search dropdown
  vm.selectCommon = function(ev, item){
    console.log('selected common:', item.food_name);
    var config = {params:{toQuery:item.food_name}};
    $http.get('api/common', config).then(function(response){
      console.log('got response');
      var data = response.data.foods[0];
      console.log('data:', data);
      vm.ms.apiFoodObject = {};

      vm.ms.apiFoodObject.name = data.food_name;
      vm.ms.apiFoodObject.servingSize = data.serving_qty + data.serving_unit;
      vm.ms.apiFoodObject.calories = parseInt(data.nf_calories);
      vm.ms.apiFoodObject.fat = parseInt(data.nf_total_fat);
      vm.ms.apiFoodObject.carbohydrates = parseInt(data.nf_total_carbohydrate);
      vm.ms.apiFoodObject.fiber = parseInt(data.nf_dietary_fiber);
      vm.ms.apiFoodObject.sugar = parseInt(data.nf_sugars);
      vm.ms.apiFoodObject.protein = parseInt(data.nf_protein);
      vm.ms.apiFoodObject.sodium = parseInt(data.nf_sodium);

      vm.apiSearchText = '';
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/views/partials/addFromCommon.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    });
  };

  //// TEST FUNCTION ////
  vm.test = function(){
    console.log('in test');
  };

  function DialogController(MealsService, $scope, $mdDialog) {
    $scope.favObject = MealsService.favObject;
    $scope.entryToEdit = MealsService.entryToEdit;
    $scope.apiFoodObject = MealsService.apiFoodObject;

    $scope.edit = function(ev) {
      $mdDialog.hide();
      editFavoriteModal(ev);

    };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.delete = function(fav) {
      console.log("in delete with:", fav);
      $http.delete('/meals/deleteFavorite/' + fav._id).then(function(response){
        console.log('Favorite deleted.');
        getFavorites();
        $mdDialog.hide();
      });
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

      $http.post('/meals/createEntry', favToEnter).then(function(response){
        console.log('got response from PUT /meals/createEntry');
        $mdDialog.hide();
        getTodayProgress();
      });
    };

    $scope.updateFavorite = function(fav){
      console.log('updating favorite:', fav);
      $http.put('/meals/updateFavorite', fav).then(function(response){
        console.log('got response from PUT /meals/updateFavorite');
        $mdDialog.hide();
        getFavorites();
      });
    };

    $scope.updateEntry = function(entry){
      console.log('updating entry:', entry);
      $http.put('/meals/updateEntry', entry).then(function(response){
        console.log('got response from PUT /meals/updateEntry');
        $mdDialog.hide();
        getTodayProgress();
      });
    };
  }

});

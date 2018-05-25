myApp.controller('MealsController', function(UserService, MealsService, $http, $mdDialog, $mdPanel, $scope, $modal, $log) {
  console.log('MealsController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.ms = MealsService;

/// TO DO ///
/// CONFIRMATION DIALOGS
/// ENTRIES DIRECTLY FROM API ARE NOT ACCOUNTING FOR NUMBER OF SERVINGS OTHER THAN 1
/// CLICK/HOVER TO ENLARGE API IMAGES
/// HISTORICAL ENTRIES EDITABLE

  getGoals();
  getTodayProgress();
  getFavorites();

  // Determines caloric content for each meal entry
  function calcCaloricComposition(today){
    // console.log('calculation caloric compositions');
    for (var i = 0; i < today.length; i++) {
      today[i].fatPercent = ((9 * today[i].fat) / today[i].calories) * 100;
      today[i].proteinPercent = ((4 * today[i].protein) / today[i].calories) * 100;
      today[i].carbPercent = 100 - today[i].fatPercent - today[i].proteinPercent;
    }
  }

  // Calculates nutrient totals for the day //// REWORK THIS FUNCTION
  function calcDailyTotal(today){
    // console.log('calculating totals');
    vm.todayTotal = angular.copy(today[0]);
    for (var i = 1; i < today.length; i++) {
      for (var key in today[i]) {
        var b = today[i];
        vm.todayTotal[key] += b[key];
      }
    }
  }

  // Creates modal for editing a Favorites entry
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

  // Gets user's saved favorites
  function getFavorites(){
    $http.get('/meals/getFavorites').then(function(response){
      console.log('getFavorites response data is:', response.data);
      vm.favorites = response.data;
      for (var i = 0; i < vm.favorites.length; i++) {
        vm.favorites[i].servings = 1;
      }
    });
  }

  // Gets user's nutritional goals
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

  // Creates modal for adding a meal entry
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

  // Brings up modal with Favorites entry information and options
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

  // Send a meal entry to be added to the database
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
      console.log('got response from POST /meals/createEntry');
      getTodayProgress();
    });
  };


  // Delete a meal entry from the database
  vm.deleteEntry = function(entry){
    $http.delete('/meals/deleteEntry/' + entry._id).then(function(response){
      console.log('Entry deleted.');
      getTodayProgress();
      $mdDialog.hide();
    });
  };

  // Update a meal entry in the database
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

  // Brings up the options menu for meal entries
  vm.entryOptionsMenu = function($mdMenu, ev, item) {
    console.log('in entryOptionsMenu(), item is:', item);
    $mdMenu.open(ev);
    vm.menuItem = item;
    console.log('vm.menuItem is:', vm.menuItem);
  };

  function formatEntry(obj, math){
    var props = ["calories", "carbohydrates", "fat", "fiber", "protein", "sodium", "sugar"];
    try {
      if(math != "per serving" && math != "total") throw "Illegal math argument sent to formatEntry";
      if(!obj._id || !obj.$$hashKey) throw "Invalid object sent to formatEntry"
      delete obj._id;
      delete obj.$$hashKey;
      if(math == "per serving"){
        for (var i = 0; i < props.length; i++) {
          obj[props[i]] /= obj.servings;
        }
      } else {
        for (var i = 0; i < props.length; i++) {
          obj[props[i]] *= obj.servings;
        }
      }
    } catch(err) {
      console.log(err);
    }
  }

  // Save an entry to favorites
  vm.saveToFavorites = function(item){
    console.log('in saveToFavorites with:', item);
    formatEntry(item, "per serving");
    console.log('sending to POST addFavorite:', item);
    $http.post('/meals/addFavorite', item).then(function(response){
      console.log('got response from POST /meals/addFavorite');
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
      formatEntry(favObj, "total");
      console.log('FAV BJECT ISL:',favObj);
      $http.post('/meals/createEntry', favObj).then(function(response){
        console.log('got response from POST /meals/createEntry');
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

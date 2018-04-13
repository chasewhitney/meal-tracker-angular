myApp.controller('TestingController', function(UserService, $scope, $modal, $log, $mdDialog, $http) {
  console.log('TestingController created');
  var vm = this;
  vm.userService = UserService;

vm.testingVar = "TEST SUCCESS";
vm.test = function(){
  console.log('testVar is:', vm.testVar);
}


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

//// AUTOLOAD FOR TEST ////
// vm.instantSearch('wheat');

vm.testCommon = function(toQuery){
  console.log("in test function");
  console.log("you entered:", toQuery);


  $.ajax({
    type: 'POST',
    url: '/common',
    data:{toQuery : toQuery},
    success: function(response) {
      var data = response.foods[0];
      console.log('data:', data);
    }
  });
}

vm.testBranded = function(toQuery){
  console.log("in test function");
  console.log("you entered:", toQuery);


  $.ajax({
    type: 'GET',
    url: '/branded',
    data:{toQuery : toQuery},
    success: function(response) {
      var data = response.foods[0];
      console.log('data:', data);
    }
  });
}

vm.selectCommon = function(item){
  console.log('selected common:', item);
}

vm.selectBranded= function(item){
  console.log('selected branded:', item);
}
});

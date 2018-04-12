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
  if (toQuery.length > 2) {
    var config = {params: {searchQuery: toQuery,}};
    $http.get('api/instant', config).then(function(response){
      console.log('Response from api/instant GET');
      var data = response.data;
        console.log('data:', data);
    });
  }
};

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


});

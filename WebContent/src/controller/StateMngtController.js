var datavisual = angular.module('planning', ['angularUtils.directives.dirPagination']);

datavisual.controller('StateMngtController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var timeFormat = 'MM/DD/YYYY HH:mm:ss';
	$scope.pageno = 1;
	$scope.total_count = 0;
	$scope.itemsPerPage = 10;
	
	$scope.doSearch = function(pageno) {
		//search data
		$scope.stateList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchState?pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
				$scope.total_count = data[i].totalResult;
			}
			$scope.stateList = data;
			if($scope.stateList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};
	
    $scope.doSearch(1)
});



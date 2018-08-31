var datavisual = angular.module('planning', ['angularUtils.directives.dirPagination']);

datavisual.controller('ProjectMngtController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
//	var BASE_URL = "http://147.47.206.15:29001/";
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
		$scope.projectList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchProject?pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
				$scope.total_count = data[i].totalResult;
			}
			$scope.projectList = data;
			if($scope.projectList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};
	
	$scope.addNew = function() {
        // open new window
        w = 800; h = 800;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("project_mngt_insert.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };
	
    $scope.doSearch(1);
});



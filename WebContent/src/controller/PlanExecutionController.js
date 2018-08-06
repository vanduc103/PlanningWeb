var planning = angular.module('planning', ['angularUtils.directives.dirPagination']);

planning.controller('PlanExecutionController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var timeFormat = 'YYYY/MM/DD HH:mm:ss';
	$scope.pageno = 1;
	$scope.total_count = 0;
	$scope.itemsPerPage = 10;
    $scope.plan_id = -1;
    $scope.plan_name = '';

    //get plan from another page
	var otherPagePlanId = sessionStorage.getItem("plan_id");
    var otherPagePlanName = sessionStorage.getItem("plan_name");
	if(otherPagePlanId !== undefined && otherPagePlanId !== '') {
		$scope.plan_id = otherPagePlanId;
        // get plan name from DB
        var url = BASE_URL + 'searchPlan?planId=' + $scope.plan_id;
		$http.get(url).then(function(response) {
			var data = response.data;
            if (data.length > 0) {
			    $scope.plan_name = data[0].name;
            }
		});
	}
	
	$scope.doSearch = function(pageno) {
		//search data
		$scope.exeList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchPlanExecution?planId=' + $scope.plan_id + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
				$scope.total_count = data[i].totalResult;
			}
			$scope.exeList = data;
			if($scope.exeList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};
	
	function dateFormat(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};
	
	
    $scope.doSearch(1)
});



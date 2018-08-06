var planning = angular.module('planning', ['angularUtils.directives.dirPagination']);

planning.controller('PlanDetailController', function($scope, $http, $interval) {
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
	if(otherPagePlanName !== undefined && otherPagePlanName !== '') {
		$scope.plan_id = otherPagePlanId;
        $scope.plan_name = otherPagePlanName;
	}
	
	$scope.doSearch = function(pageno) {
		//search data
		$scope.detailList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchPlanDetail?planId=' + $scope.plan_id + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
				$scope.total_count = data[i].totalResult;
			}
			$scope.detailList = data;
			if($scope.detailList.length <= 0) {
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



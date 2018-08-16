var planning = angular.module('planning', ['angularUtils.directives.dirPagination']);

planning.controller('PlanVersionViewController', function($scope, $http, $interval) {
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

    $scope.versionId = 0;
    $scope.latestVersion = 0;

	//get plan from another page
    var otherPagePlanId = sessionStorage.getItem("plan_id");
    if(otherPagePlanId !== undefined && otherPagePlanId !== '') {
	    $scope.plan_id = otherPagePlanId;
        // get plan name from DB
        var url = BASE_URL + 'searchPlan?planId=' + $scope.plan_id;
	    $http.get(url).then(function(response) {
		    var data = response.data;
            if (data.length > 0) {
		        $scope.plan_name = data[0].name;
                $scope.latestVersion = data[0].versionId;
            }
	    });
    }
	
    $scope.doSearchRevision = function() {
		//search data
		$scope.revisionList = [];
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchPlanRevision?planId=' + $scope.plan_id;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1;
			}
			$scope.revisionList = data;
			if($scope.revisionList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};

    $scope.doViewVersion = function(id) {
        $scope.versionId = id;
        if ($scope.versionId == $scope.latestVersion) {
            $scope.doSearchPlanDetail(1);
        }
        else {
            $scope.doSearchDetailRevision(1);
        }
    };

	$scope.doSearchPlanDetail = function(pageno) {
		//search data
		$scope.detailList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchPlanDetail?planId=' + $scope.plan_id + '&curVersion=' + $scope.versionId
                                                        + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
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

    $scope.doSearchDetailRevision = function(pageno) {
		//search data
		$scope.detailList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
        var url = BASE_URL + 'searchDetailRevision?planId=' + $scope.plan_id + '&curVersion=' + $scope.versionId
                                                + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
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

    // start
	$scope.doSearchRevision();
});



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
		$scope.detailList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchPlanDetail?planId=' + $scope.plan_id + '&searchActual=true'
                            + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
                data[i].actual_value = data[i].actual_value.toLocaleString();
				$scope.total_count = data[i].totalResult;
			}
			$scope.detailList = data;
			if($scope.detailList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};

    $scope.doSearchRule = function(pageno) {
		//search data
		$scope.ruleList = [];
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchConstraint?planId=' + $scope.plan_id + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
			}
			$scope.ruleList = data;
			if($scope.ruleList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};
	
	function dateFormat(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};

    $scope.addNew = function() {
        if ($scope.plan_id == -1) return;
        // store plan_id to session
        sessionStorage.setItem("plan_id", $scope.plan_id);
        // open new window
        w = 800; h = 600;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("plan_detail_insert.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };

    $scope.addNewConstraint = function() {
        if ($scope.plan_id == -1) return;
        // store plan_id to session
        sessionStorage.setItem("plan_id", $scope.plan_id);
        // open new window
        w = 800; h = 600;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("constraint_insert.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };

    $scope.viewExecutionLog = function() {
        if ($scope.plan_id == -1) return;
        // move to plan execution page
        sessionStorage.setItem("plan_id", $scope.plan_id);
        document.location.href = 'plan_execution.html';
    };
	
    // start
	$scope.doSearchRule(1);
    $scope.doSearch(1);
});



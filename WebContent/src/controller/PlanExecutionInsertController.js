var datavisual = angular.module('planning', []);

datavisual.controller('PlanExecutionInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var timeFormat = 'MM/DD/YYYY HH:mm:ss';

    $scope.plan_id = -1;
    $scope.plan_name = '';

    $scope.parentId = -1;
    $scope.newExecution = {"itemId": -1, "itemValue": '', "itemUnit": "", "startDate": "", "endDate": "", "purpose": "", "method": ""}
	
    //get plan from another page
	var otherPagePlanId = sessionStorage.getItem("plan_id");
	if(otherPagePlanId !== undefined && otherPagePlanId !== 'null') {
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

	$scope.doSearchParentItem = function() {
		//search data
		$scope.parentItemList = [];
		//search condition
		var url = BASE_URL + 'searchPlanItem?pageIndex=1&pageSize=100&searchParent=true';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.parentItemList = data;
		});
	};

    $scope.doSearchItem = function() {
		//search data
		$scope.itemList = [];
		//search condition
		var url = BASE_URL + 'searchPlanItem?pageIndex=1&pageSize=100&parentId='+$scope.parentId;
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.itemList = data;
		});
	};

    $scope.doSubmit = function() {
		//submit data
		if ($scope.newExecution.itemId == -1) {
            alert('Please choose an item !');
            return;
        }
        if ($scope.newExecution.itemValue.trim() == '') {
            alert('Please input value for item !');
            return;
        }
        if ($scope.newExecution.startDate.trim() == '') {
            alert('Please input start date for this execution !');
            return;
        }
        if ($scope.newExecution.endDate.trim() == '') {
            alert('Please input end date for this execution !');
            return;
        }
        //plan_id
	    if($scope.plan_id != -1) {
		    //submit url
            var url = BASE_URL + 'newPlanExecution?planId=' + $scope.plan_id
                                                + '&itemId=' + $scope.newExecution.itemId 
                                                + '&itemValue=' + $scope.newExecution.itemValue
                                                + '&startDate=' + $scope.newExecution.startDate
                                                + '&endDate=' + $scope.newExecution.endDate
                                                + '&purpose=' + encodeURIComponent($scope.newExecution.purpose)
                                                + '&method=' + encodeURIComponent($scope.newExecution.method);
		    $http.get(url).then(function(response) {
                var data = response.data;
                if (data != '0') {
			        alert('Insert successfully !');
                    $scope.parentId = -1;
                    $scope.newExecution = {"itemId": -1, "itemValue": '', "itemUnit": "", "startDate": "", "endDate": "", "purpose": "", "method": ""};

                    window.opener.location.reload();
                    //close();
                }
                else {
                    alert('Insert failed !');
                }
		    });
        }
	};

    $scope.doClose = function() {
        close();
    }

    $scope.selectParentItem = function() {
        $scope.parentId = $scope.parentItem.id;
        $scope.doSearchItem();
    };

    $scope.selectItem = function(unitName) {
        $scope.newExecution.itemUnit = unitName;
    };
	
    // start
	$scope.doSearchParentItem();
});



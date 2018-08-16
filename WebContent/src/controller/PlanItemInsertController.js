var datavisual = angular.module('planning', []);

datavisual.controller('PlanItemInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var timeFormat = 'MM/DD/YYYY HH:mm:ss';

    $scope.newItem = {"parentId": -1, "itemName": '', "itemUnit": "", "description": ""}
	
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

    $scope.doSubmit = function() {
		//submit data
        if ($scope.newItem.itemName.trim() == '') {
            alert('Please input name for item !');
            return;
        }
        if ($scope.newItem.itemUnit.trim() == '') {
            alert('Please input unit name for item !');
            return;
        }
        //submit url
        var url = BASE_URL + 'newItem?parentId='+$scope.newItem.parentId
                                            +'&itemName='+$scope.newItem.itemName 
                                            + '&itemUnit='+$scope.newItem.itemUnit
                                            + '&description='+$scope.newItem.description;
	    $http.get(url).then(function(response) {
            var data = response.data;
            if (data != '0') {
		        alert('Insert successfully !');
                window.opener.location.reload();
                close();
            }
            else {
                alert('Insert failed !');
            }
	    });
	};

    $scope.doClose = function() {
        close();
    };

	$scope.doSearchParentItem();
});



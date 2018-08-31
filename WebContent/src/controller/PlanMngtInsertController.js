var datavisual = angular.module('planning', []);

datavisual.controller('PlanMngtInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";

    $scope.projectId = -1;
    $scope.newPlan = {'parentId': -1, 'planName': ''}

    //get project from parent page
	var otherPageProjectId = sessionStorage.getItem("project_id");
	if(otherPageProjectId !== undefined && otherPageProjectId !== 'null') {
		$scope.projectId = otherPageProjectId;
	}
	
	$scope.doSearchParentPlan = function() {
		//search data
		$scope.parentPlanList = [];
		//search condition
		var url = BASE_URL + 'searchPlan?projectId='+$scope.projectId;
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.parentPlanList = data;
		});
	};

    $scope.doSubmit = function() {
		//submit data
        if ($scope.newPlan.planName.trim() == '') {
            alert('Please input name for plan !');
            return;
        }
        //submit url
        var url = BASE_URL + 'newPlan?projectId=' + $scope.projectId
                                    + '&parentId=' + $scope.newPlan.parentId
                                    + '&name=' + $scope.newPlan.planName;
	    $http.get(url).then(function(response) {
            var data = response.data;
            if (data != '0') {
		        alert('Insert successfully !');
                window.opener.location.reload();
                $scope.newPlan = {'parentId': -1, 'planName': ''}
                //close();
            }
            else {
                alert('Insert failed !');
            }
	    });
	};

    $scope.doClose = function() {
        close();
    };

	$scope.doSearchParentPlan();
});



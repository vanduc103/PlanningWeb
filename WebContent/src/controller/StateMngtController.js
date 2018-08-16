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
    $scope.projectId = -1;
    $scope.projectName = '';
	
    $scope.listProject = function() {
        $scope.projList = [];
        var url = BASE_URL + 'searchProject?pageIndex=1&pageSize=100';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.projList = data;
		});
    };

    $scope.selectProject = function(projName) {
        $scope.projectName = projName;
    };

	$scope.doSearch = function(pageno) {
        // search condition
		var projId = $scope.projectId;
		if(projId == -1) {
			alert('You must choose a Project !');
			return false;
		}
		//search data
		$scope.stateList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchState?projectId=' + projId + '&pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
            var goal_idx = -1;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
				$scope.total_count = data[i].totalResult;
                if (data[i].is_goal == 1) goal_idx = i;
			}
            // calculate distance to goal
            completed_goal = 0;
            passed_month_goal = 1;
            for(var i in data) {
                // extract content to find %complete and passed months
                items = data[i].content.split(" ");
                data[i].completed = parseInt(items[0]);
                data[i].passed_month = items[2];
                if (i == goal_idx) {
                    completed_goal = data[i].completed;
                    passed_month_goal = data[i].passed_month;
                }
            }
            balance_ratio = completed_goal/passed_month_goal;
            for(var i in data) {
                if (i == goal_idx) data[i].distance2goal = 0;
                else data[i].distance2goal = 
                            Math.abs(data[i].completed - completed_goal)/balance_ratio 
                          + Math.abs(data[i].passed_month - passed_month_goal);
                data[i].distance2goal = data[i].distance2goal.toFixed(1);
            }

			$scope.stateList = data;
			if($scope.stateList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};
	
    $scope.listProject();
});



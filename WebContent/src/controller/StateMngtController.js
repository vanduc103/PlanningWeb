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

    $scope.selectProject = function() {
        $scope.projectId = $scope.selectedProj.id;
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
            completed_goal1 = 0;
            passed_month_goal1 = 1;
            completed_goal2 = 0;
            passed_month_goal2 = 1;
            for(var i in data) {
                // extract content to find %complete and passed months
                items1 = data[i].plan_state.split(" ");
                data[i].completed1 = parseInt(items1[0]);
                data[i].passed_month1 = items1[2];
                if (i == goal_idx) {
                    completed_goal1 = data[i].completed1;
                    passed_month_goal1 = data[i].passed_month1;
                }
                items2 = data[i].content.split(" ");
                data[i].completed2 = parseInt(items2[0]);
                data[i].passed_month2 = items2[2];
                if (i == goal_idx) {
                    completed_goal2 = data[i].completed2;
                    passed_month_goal2 = data[i].passed_month2;
                }
            }
            balance_ratio1 = completed_goal1/passed_month_goal1;
            balance_ratio2 = completed_goal2/passed_month_goal2;
            for(var i in data) {
                if (i == goal_idx) {
                    data[i].distance2goal1 = 0;
                    data[i].distance2goal2 = 0;
                }
                else {
                    data[i].distance2goal1 = 
                            Math.abs(data[i].completed1 - completed_goal1)/balance_ratio1 
                          + Math.abs(data[i].passed_month1 - passed_month_goal1);
                    data[i].distance2goal2 = 
                            Math.abs(data[i].completed2 - completed_goal2)/balance_ratio2 
                          + Math.abs(data[i].passed_month2 - passed_month_goal2);
                }
                data[i].distance2goal1 = data[i].distance2goal1.toFixed(1);
                data[i].distance2goal2 = data[i].distance2goal2.toFixed(1);
            }

			$scope.stateList = data;
			if($scope.stateList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};

    $scope.distanceView = function() {
        // open new window
        w = 960; h = 630;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("state_distance_view.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };

    $scope.addNew = function() {
        // open new window
        w = 800; h = 800;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("state_mngt_insert.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };
	
    // start
    $scope.listProject();
});



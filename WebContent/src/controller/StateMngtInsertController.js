var datavisual = angular.module('planning', []);

datavisual.controller('StateMngtInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";

    $scope.newState = {'projectId': -1, 'name': '', 'curState': '', 'planState': '', 'result': '', 'checkpointDate': '', 'isInitial': 0, 'isGoal': 0}

	$scope.doSearchProject = function() {
		//search data
		$scope.projectList = [];
		//search condition
		var url = BASE_URL + 'searchProject?pageSize=100';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.projectList = data;
		});
	};

    $scope.doSubmit = function() {
		//validate submit data
        if ($scope.newState.projectId == -1) {
            alert('Please choose a project !');
            return;
        }
        if ($scope.newState.name.trim() == '') {
            alert('Please input state name !');
            return;
        }
        if ($scope.newState.checkpointDate.trim() == '') {
            alert('Please input checkpoint date !');
            return;
        }

        //submit url
        var url = BASE_URL + 'newState?projectId=' + $scope.newState.projectId
                                    + '&name=' + $scope.newState.name
                                    + '&curState=' + encodeURI($scope.newState.curState)
                                    + '&planState=' + encodeURI($scope.newState.planState)
                                    + '&result=' + encodeURI($scope.newState.result)
                                    + '&checkpointDate=' + $scope.newState.checkpointDate
                                    + '&isInitial=' + $scope.newState.isInitial
                                    + '&isGoal=' + $scope.newState.isGoal;
	    $http.get(url).then(function(response) {
            var data = response.data;
            if (data != '0') {
		        alert('Insert successfully !');
                //window.opener.location.reload();
                $scope.newState = {'projectId': -1, 'name': '', 'curState': '', 'planState': '', 'result': '', 'checkpointDate': '', 'isInitial': false, 'isGoal': false};
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

    // start
	$scope.doSearchProject();
});



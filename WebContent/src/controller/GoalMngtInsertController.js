var datavisual = angular.module('planning', []);

datavisual.controller('GoalMngtInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";

    $scope.newGoal = {'parentId': -1, 'target': '', 'description': ''}

	$scope.doSearchParentGoal = function() {
		//search data
		$scope.parentGoalList = [];
		//search condition
		var url = BASE_URL + 'searchGoal?searchParent=true';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.parentGoalList = data;
		});
	};

    $scope.doSubmit = function() {
		//submit data
        if ($scope.newGoal.target.trim() == '') {
            alert('Please input target for goal !');
            return;
        }
        //submit url
        var url = BASE_URL + 'newGoal?parentId=' + $scope.newGoal.parentId
                                    + '&target=' + $scope.newGoal.target
                                    + '&description=' + $scope.newGoal.description;
	    $http.get(url).then(function(response) {
            var data = response.data;
            if (data != '0') {
		        alert('Insert successfully !');
                window.opener.location.reload();
                $scope.newGoal = {'parentId': -1, 'target': '', 'description': ''}
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
	$scope.doSearchParentGoal();
});



var datavisual = angular.module('planning', []);

datavisual.controller('ProjectMngtInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";

    $scope.newProj = {'goalId': -1, 'code': '', 'name': '', 'description': '', 'date_start': '', 'date_end': '', 'managerId': -1}

	$scope.doSearchGoal = function() {
		//search data
		$scope.goalList = [];
		//search condition
		var url = BASE_URL + 'searchGoal';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.goalList = data;
		});
	};

    $scope.doSearchUser = function() {
		//search data
		$scope.userList = [];
		//search condition
		var url = BASE_URL + 'searchUser';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.userList = data;
		});
	};

    $scope.doSubmit = function() {
		//submit data
        if ($scope.newProj.goalId == -1) {
            alert('Please choose a Goal !');
            return;
        }
        if ($scope.newProj.code.trim() == '') {
            alert('Please input project Code !');
            return;
        }
        if ($scope.newProj.name.trim() == '') {
            alert('Please input project Name !');
            return;
        }
        if ($scope.newProj.date_start.trim() == '') {
            alert('Please input a valid project Start date !');
            return;
        }
        if ($scope.newProj.date_end.trim() == '') {
            alert('Please input a valid project End date !');
            return;
        }
        if ($scope.newProj.managerId == -1) {
            alert('Please choose a project Manager !');
            return;
        }
        //submit url
        var url = BASE_URL + 'newProject?goalId=' + $scope.newProj.goalId
                                    + '&code=' + $scope.newProj.code
                                    + '&name=' + $scope.newProj.name
                                    + '&description=' + $scope.newProj.description
                                    + '&date_start=' + $scope.newProj.date_start
                                    + '&date_end=' + $scope.newProj.date_end
                                    + '&managerId=' + $scope.newProj.managerId;
	    $http.get(url).then(function(response) {
            var data = response.data;
            if (data != '0') {
		        alert('Insert successfully !');
                window.opener.location.reload();
                $scope.newProj = {'goalId': -1, 'code': '', 'name': '', 'description': '', 'date_start': '', 'date_end': '', 'managerId': -1}
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
	$scope.doSearchGoal();
    $scope.doSearchUser();
});



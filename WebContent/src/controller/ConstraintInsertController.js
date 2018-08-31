var datavisual = angular.module('planning', []);

datavisual.controller('ConstraintInsertController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";

    $scope.planId = -1;
    $scope.newRule = {'ruleName': ''}

    //get plan from parent page
	var otherPagePlanId = sessionStorage.getItem("plan_id");
	if(otherPagePlanId !== undefined && otherPagePlanId !== 'null') {
		$scope.planId = otherPagePlanId;
	}
	
    $scope.doSubmit = function() {
		//submit data
        if ($scope.planId == -1) {
            return;
        }
        if ($scope.newRule.ruleName.trim() == '') {
            alert('Please input constraint rule !');
            return;
        }
        //submit url
        var url = BASE_URL + 'newConstraint?planId=' + $scope.planId
                                    + '&ruleName=' + $scope.newRule.ruleName;
	    $http.get(url).then(function(response) {
            var data = response.data;
            if (data != '0') {
		        alert('Insert successfully !');
                window.opener.location.reload();
                $scope.newRule = {'ruleName': ''};
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

});



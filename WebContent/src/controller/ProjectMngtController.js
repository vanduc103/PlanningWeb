var datavisual = angular.module('planning', ['angularUtils.directives.dirPagination']);

datavisual.controller('ProjectMngtController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
//	var BASE_URL = "http://147.47.206.15:29001/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var timeFormat = 'MM/DD/YYYY HH:mm:ss';
	$scope.pageno = 1;
	$scope.total_count = 0;
	$scope.itemsPerPage = 10;
	
	$scope.doSearch = function(pageno) {
		//get time
		/*var fromTime = $("#datetimepicker1").data("DateTimePicker").date();
		if(fromTime === null) {
			alert('You must input Date Time !');
			return false;
		}
		fromTime = fromTime.unix() * 1000;
		var toTime = $("#datetimepicker2").data("DateTimePicker").date();
		if(toTime === null) {
			toTime = new Date().getTime();
		}
		else {
			toTime = toTime.unix() * 1000;
		}
		var macAddress = $("#searchMac").val();
		if(macAddress.trim() === '') {
			alert('You must input MAC address !');
			return false;
		}*/
		//search data
		$scope.projectList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchProject?pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].index = parseInt(i) + 1 + (pageno - 1) * $scope.itemsPerPage;
				$scope.total_count = data[i].totalResult;
			}
			$scope.projectList = data;
			if($scope.projectList.length <= 0) {
				$scope.loading = 'No data found !';
				return;
			}
		});
	};
	
	function dateFormat(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};
	
	
	$scope.closePopup = function() {
		$('#graph-popup').fadeOut('fast');
	}
	
    $scope.doSearch(1)
});



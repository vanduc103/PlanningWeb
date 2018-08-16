var planning = angular.module('planning', ['treeGrid']);

planning.controller('PlanVersionController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var datetimeFormat = 'YYYY/MM/DD HH:mm:ss';
	$scope.total_count = 0;
    $scope.projectId = -1;
    $scope.projectName = '';

    $scope.tree_data = [];
    $scope.expanding_property = { field: "name", displayName: "Name"};

    $scope.col_defs = [
    	{ field: "versionId", displayName: "Version"},
    	{ field: "date_created", displayName: "Date created"},
    	{ field: "user_create_name", displayName: "User created"},
        { field: "id", displayName: "Version", 
            cellTemplate: '<button class="btn btn-default btn-sm" ng-click="cellTemplateScope.click(row.branch[col.field])">View</button>',
            cellTemplateScope: {
                click: function(data) {
                    // view plan version
                    sessionStorage.setItem("plan_id", data);
        	        // open new window
                    w = screen.width; h = screen.height;
                    var left = (screen.width/2)-(w/2);
                    var top = (screen.height/2)-(h/2);
                    window.open("plan_version_view.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
                }
            }
        }
    ];

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
	
	$scope.doSearch = function() {
		// search condition
		var projId = $scope.projectId;
		if(projId == -1) {
			alert('You must choose a Project !');
			return false;
		}
		//search data
		$scope.planList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchPlan?projectId=' + projId;
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.planList = data;
            for(var i in data) {
				data[i].date_created = dateFormat(data[i].date_created, datetimeFormat);
			}
            $scope.total_count = $scope.planList.length;
			if($scope.planList.length <= 0) {
				$scope.loading = 'No data found !';
			}
            // create tree data
            var myTreeData = getTree($scope.planList, 'id', 'parentId');

            $scope.tree_data = myTreeData;
            $scope.my_tree = tree = {};
            
            $scope.my_tree_handler = function(branch){
                // move to plan detail page
                sessionStorage.setItem("plan_id", branch.id);
                sessionStorage.setItem("plan_name", branch.name);
    	        document.location.href = 'plan_detail.html';
            }
		});
	};

    function getTree(data, primaryIdName, parentIdName){
	    if(!data || data.length==0 || !primaryIdName ||!parentIdName) {
		    return [];
        }

	    var tree = [],
		    rootIds = [],
		    item = data[0],
		    primaryKey = item[primaryIdName],
		    treeObjs = {},
		    parentId,
		    parent,
		    len = data.length,
		    i = 0;
	
	    while(i<len){
		    item = data[i++];
		    primaryKey = item[primaryIdName];			
		    treeObjs[primaryKey] = item;
		    parentId = item[parentIdName];

		    if(parentId){
			    parent = treeObjs[parentId];	

			    if(parent.children){
				    parent.children.push(item);
			    }
			    else{
				    parent.children = [item];
			    }
		    }
		    else{
			    rootIds.push(primaryKey);
		    }
	    }

	    for (var i = 0; i < rootIds.length; i++) {
		    tree.push(treeObjs[rootIds[i]]);
	    };

	    return tree;
    };

    function dateFormat(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};

    $scope.listProject();
});



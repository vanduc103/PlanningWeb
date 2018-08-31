var planning = angular.module('planning', ['treeGrid']);

planning.controller('PlanMngtController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
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
    	{ field: "versionId", displayName: "Version",
            cellTemplate: '<a ng-click="cellTemplateScope.click(row.branch[\'id\'])">{{ row.branch[col.field] }}</a>',
            cellTemplateScope: {
                click: function(data) {
                    // open plan version view
                    sessionStorage.setItem("plan_id", data);
        	        // open new window
                    w = screen.width; h = screen.height;
                    var left = (screen.width/2)-(w/2);
                    var top = (screen.height/2)-(h/2);
                    window.open("plan_version_view.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
                }
            }
        },
    	{ field: "initial_budget", displayName: "Initial budget"},
    	{ field: "executed_budget", displayName: "Executed budget"},
        { field: "id", displayName: "Action", 
            cellTemplate: '<button class="btn btn-default btn-sm" ng-click="cellTemplateScope.click(row.branch[col.field])">Update</button>',
            cellTemplateScope: {
                click: function(data) {
                    // update plan detail
                    sessionStorage.setItem("plan_id", data);
        	        document.location.href = 'plan_detail.html';
                }
            }
        },
        { field: "id", displayName: "Execution", 
            cellTemplate: '<button class="btn btn-default btn-sm" ng-click="cellTemplateScope.click(row.branch[col.field])">Execute</button>',
            cellTemplateScope: {
                click: function(data) {
                    // move to plan execution page
                    sessionStorage.setItem("plan_id", data);
        	        document.location.href = 'plan_execution.html';
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
		var url = BASE_URL + 'searchPlan?projectId=' + projId + '&searchBudget=true';
		$http.get(url).then(function(response) {
			var data = response.data;
			$scope.planList = data;
            for(var i in data) {
                data[i].initial_budget = data[i].initial_budget.toLocaleString();
                data[i].executed_budget = data[i].executed_budget.toLocaleString();
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

    $scope.addNew = function() {
        if ($scope.projectId == -1) return;
        // store project_id to session
        sessionStorage.setItem("project_id", $scope.projectId);
        // open new window
        w = 800; h = 600;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("plan_mngt_insert.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };

    function dateFormat(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};

    function numberFormat(numValue, format) {
		return d.format(format);
	};

    $scope.listProject();
});



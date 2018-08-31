var datavisual = angular.module('planning', ['treeGrid']);

datavisual.controller('GoalMngtController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	$scope.loading = 'No data found !';
	var dateFormat = 'YYYY/MM/DD';
	$scope.pageno = 1;
	$scope.total_count = 0;
	$scope.itemsPerPage = 100;

    $scope.tree_data = [];
    $scope.expanding_property = { field: "target", displayName: "Target"};

    $scope.col_defs = [
    	{ field: "date_created", displayName: "Date created"},
    	{ field: "username", displayName: "User created"},
        { field: "id", displayName: "Action", 
            cellTemplate: '<button class="btn btn-default btn-sm" ng-click="cellTemplateScope.click(row.branch[col.field])">Update</button>',
            cellTemplateScope: {
                click: function(data) {
                    // todo
                    
                }
            }
        }
    ];
	
	$scope.doSearch = function(pageno) {
		//search data
		$scope.goalList = [];
		$scope.total_count = 0;
		$scope.loading = 'Searching...';
		//search condition
		var url = BASE_URL + 'searchGoal?pageIndex=' + pageno + '&pageSize=' + $scope.itemsPerPage;
		$http.get(url).then(function(response) {
			var data = response.data;
			for(var i in data) {
				data[i].date_created = formatDate(data[i].date_created, dateFormat);
				$scope.total_count = data[i].totalResult;
			}
			$scope.goalList = data;
			if($scope.goalList.length <= 0) {
				$scope.loading = 'No data found !';
			}
            // create tree data
            var myTreeData = getTree($scope.goalList, 'id', 'parentId');

            $scope.tree_data = myTreeData;
            $scope.my_tree = tree = {};
            
            $scope.my_tree_handler = function(branch){
                // todo
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

    function formatDate(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};

    $scope.addNew = function() {
        // open new window
        w = 800; h = 600;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open("goal_mngt_insert.html", "_blank", 'width='+w+', height='+h+', top='+top+', left='+left); 
    };
	
    // start
    $scope.doSearch(1);
});



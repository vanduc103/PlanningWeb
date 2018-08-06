var datavisual = angular.module('planning', []);

datavisual.controller('MainController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";
//	var BASE_URL = "http://147.47.206.15:29001/";
	$scope.message = 'Please Wait...';
	$scope.backdrop = true;
	$scope.promise = null;
	var fromTime = 0, toTime = 0;
	var trackingGroup = sessionStorage.trackingGroup;
	if(trackingGroup === null || trackingGroup === undefined) {
		trackingGroup = [];
	} else {
		try {
			trackingGroup = JSON.parse(trackingGroup);
		}catch(e) {
			trackingGroup = [];
		}
	}
	
	//make from time and to time
	var makeTime = function() {
		var curDate = new Date();
		
		//to time = current date and time
		toTime = curDate.getTime();
		//one month ago
		//toTime = toTime - 81*24*60*60*1000;
		//toTime = toTime - 9 * 60 * 60 * 1000;
		//fromTime = toTime - 1 minutes
		fromTime = toTime - 5*60*1000;
		//var fromTime = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()-10, 0, 0, 0).getTime();
	}
		
	//init variable
	var width = 624,
    height = 527,
    centered;

	var svg = d3.select("#planning").append("svg")
	    .attr("width", width)
	    .attr("height", height)
		.append("g");
	var g = svg.append("g");
	var centerJson = [];
	// Define the div for the tooltip
	var div = d3.select("body").append("div")	
	    .attr("class", "tooltip")
	    .style("opacity", 0);
	//function init
	var init = function() {
		d3.json("../json/polygon_data.json", function(error, polygon) {
			if(error) {
				alert(error);
			}
			// data from polygonData is used to draw rectangle and text
			for(var i = 0; i < polygon.menu.length; i++) {
				menuData = polygon.menu[i][0]
				textData = polygon.text[i][0]
				//draw rectangle
                menu_x = (width - menuData.width)/2 + menuData.dx
				var rectangle = g.append("rect")
										 .attr("stroke", "black")
								 		 .attr("stroke-width", 3)
							 		 	 .attr("fill", "white")
			                             .attr("x", menu_x)
			                             .attr("y", menuData.y)
			                             .attr("width", menuData.width)
			                             .attr("height", menuData.height);


                // draw arrow
                if (i < polygon.menu.length - 1) {
                    lineData = polygon.line[i][0]
                    var arrow = g.append("line")
                                    .style("stroke", "black")  // colour the line
                                    .attr("stroke-width", 2)
                                    .attr("x1", (width/2 + lineData.dx1))     // x position of the first end of the line
                                    .attr("y1", (lineData.y1))      // y position of the first end of the line
                                    .attr("x2", (width/2 + lineData.dx2))     // x position of the second end of the line
                                    .attr("y2", (lineData.y2));
                }
				
				//for rotate -> not set x, y but set translate in transform attr.
				var text = g.append("text")
							.text(textData.text)
							.attr("font-family", "sans-serif")
							.attr("font-size", textData.fontSize)
                            .style("fill", "#00f")
							.attr("transform", "translate (" + (menu_x + textData.dx) + "," + (menuData.y + textData.dy) + ") rotate("+textData.transform+")" )
							.attr("fill", "black");
                
                // Icon add and view
                addIcon = polygon.addIcon[i][0]
                g.append("svg:image")
                            .attr('x', menu_x + addIcon.dx)
                            .attr('y', menuData.y + addIcon.dy)
                            .attr('width', addIcon.width)
                            .attr('height', addIcon.height)
                            .attr("xlink:href", "../images/add.png")
                /*g.append('rect')
                          .attr('class', 'image-border')
                          .attr('x', menu_x + addIcon.dx)
                          .attr('y', menuData.y + addIcon.dy)
                          .attr('width', addIcon.width)
                          .attr('height', addIcon.height);*/

                viewIcon = polygon.viewIcon[i][0]
                /*g.append('rect')
                          .attr('class', 'image-border')
                          .attr('x', menu_x + viewIcon.dx)
                          .attr('y', menuData.y + viewIcon.dy)
                          .attr('width', viewIcon.width)
                          .attr('height', viewIcon.height);*/
                g.append("svg:image")
                            .attr('class', 'viewIcon')
                            .attr('x', menu_x + viewIcon.dx)
                            .attr('y', menuData.y + viewIcon.dy)
                            .attr('width', viewIcon.width)
                            .attr('height', viewIcon.height)
                            .attr("xlink:href", "../images/view.png")
                            .on("click", clicked);
			}
		});

	    function clicked(d) {
            d3.selectAll('.viewIcon')
              .on('click', function(d, i) {
                 // move to corresponding page
                 switch(i) {
                    case 0: 
                            document.location.href = 'goal_mngt.html';
                            break;
                    case 1: 
                            document.location.href = 'state_mngt.html';
                            break;
                    case 2: 
                            document.location.href = 'project_mngt.html';
                            break;
                    case 3: 
                    case 4:
                    case 5:
                            document.location.href = 'plan_mngt.html';
                            break;
                    case 6: 
                            document.location.href = 'plan_execution.html';
                            break;
                 }
              });
        };
	};

	function mouseovered(active, i) {
		g.selectAll("path")
	      .classed("active", function(d) { return d === active; });
		
	};
	
	function mouseouted(out) {
		g.selectAll("path")
	      .classed("none", function(d) { return d === out; });
	};
	
	function paddingZero(numberValue) {
		if(numberValue < 10) {
			return '0' + numberValue;
		}
		return numberValue;
	}
	
	
	function viewDetail(d) {
		var sectionId = d.sectionId;
		$scope.realTimeTrackingDetail(sectionId, d3.event.pageX, d3.event.pageY);
	};
	
	
	function dateFormat(dateValue, format) {
		var d = moment(dateValue);
		return d.format(format);
	};
	
	//init
	init();
});

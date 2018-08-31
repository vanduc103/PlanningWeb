var datavisual = angular.module('planning', []);

datavisual.controller('StateDistanceViewController', function($scope, $http, $interval) {
	var BASE_URL = "http://localhost:9000/";
//	var BASE_URL = "http://147.47.206.15:19000/";

	
    $scope.doClose = function() {
        close();
    };

    var data0 = [{'label': 'Initial state', 'x': 0, 'y': 0}, {'label': 'Goal state', 'x': 100, 'y': 12}];
    var data1 = [{'label': 'State 1.1', 'x': 10, 'y': 1}, {'label': 'State 1.2', 'x': 30, 'y': 4}, 
                 {'label': 'State 1.3', 'x': 60, 'y': 5}, {'label': 'State 1.4', 'x': 80, 'y': 10}];
    var data2 = [{'label': 'State 2.1', 'x': 20, 'y': 1}, {'label': 'State 2.2', 'x': 55, 'y': 7}, 
                 {'label': 'State 2.3', 'x': 85, 'y': 11}];
   
    var margin = {top: 20, bottom: 60, left: 40, right: 20}
      , width = 800 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
              .domain([0, 100])
              .range([ 0, width ]);
    
    var y = d3.scale.linear()
    	      .domain([0, 12])
    	      .range([ height, 0 ]);
 
    var chart = d3.select('#viewDiv')
	.append('svg:svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.attr('class', 'chart')

    var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main')   
        
    // draw the x axis
    var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

    main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');

    main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis);

    var g = main.append("svg:g"); 
    
    g.selectAll("scatter-dots")
      .data(data0)
      .enter().append("svg:circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 8).attr("fill", "black");
    g.selectAll("scatter-dots")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + function (d) { return x(d.x); } + ")") 
                .attr("transform", "translate(0," + function (d) { return y(d.y); } + ")") 
                .call(xAxis)
                .data(data0)
                .enter()
                .append("text")
                .attr("dx", "1.81em")
                .attr("dy", "-.81em")
                .attr("x", function (d) { return x(d.x); } )
                .attr("y", function (d) { return y(d.y); } )
                .style("text-anchor", "end")
                .text(function (d) { return d.label; });
    /*for (var i = 0; i < data0.length; i++) {
        g.append("line")
            .style("stroke", "black")  // colour the line
            .attr("stroke-width", 1)
            .attr("x1", x(data0[i].x))
            .attr("y1", y(data0[i].y))
            .attr("x2", x(data0[i+1].x))
            .attr("y2", y(data0[i+1].y));
        i += 1;
    }*/


    g.selectAll("scatter-dots")
      .data(data1)
      .enter().append("svg:circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 8).attr("fill", "steelblue");
    g.selectAll("scatter-dots")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + function (d) { return x(d.x); } + ")") 
                .attr("transform", "translate(0," + function (d) { return y(d.y); } + ")") 
                .call(xAxis)
                .data(data1)
                .enter()
                .append("text")
                .attr("dx", "1.81em")
                .attr("dy", "-.81em")
                .attr("x", function (d) { return x(d.x); } )
                .attr("y", function (d) { return y(d.y); } )
                .style("text-anchor", "end")
                .text(function (d) { return d.label; }) ;
    /*for (var i = 0; i < data1.length; i++) {
        g.append("line")
            .style("stroke", "black")  // colour the line
            .attr("stroke-width", 1)
            .attr("x1", x(data1[i].x))
            .attr("y1", y(data1[i].y))
            .attr("x2", x(data0[1].x))
            .attr("y2", y(data0[1].y));
    }*/


    g.selectAll("scatter-dots")
      .data(data2)
      .enter().append("svg:circle")
          .attr("cx", function (d) { return x(d.x); } )
          .attr("cy", function (d) { return y(d.y); } )
          .attr("r", 8).attr("fill", "red");
    g.selectAll("scatter-dots")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + function (d) { return x(d.x); } + ")") 
                .attr("transform", "translate(0," + function (d) { return y(d.y); } + ")") 
                .call(xAxis)
                .data(data2)
                .enter()
                .append("text")
                .attr("dx", "1.81em")
                .attr("dy", "-.81em")
                .attr("x", function (d) { return x(d.x); } )
                .attr("y", function (d) { return y(d.y); } )
                .style("text-anchor", "end")
                .text(function (d) { return d.label; }) ;
    /*for (var i = 0; i < data2.length; i++) {
        g.append("line")
            .style("stroke", "black")  // colour the line
            .attr("stroke-width", 1)
            .attr("x1", x(data2[i].x))
            .attr("y1", y(data2[i].y))
            .attr("x2", x(data0[1].x))
            .attr("y2", y(data0[1].y));
    }*/
});



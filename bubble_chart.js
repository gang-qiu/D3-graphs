(function(){document.addEventListener("DOMContentLoaded", function(event) {

	var numData = 50, xMax = 100, yMax = 100, zMax = 100, rMax = 30;
	var margin = {top: 100, bottom: 100, left: 100, right: 100};
	var outerWidth = 600, outerHeight = 600, dataMax = 100;
	var innerWidth = outerWidth - margin.left - margin.right;
	var innerHeight = outerHeight - margin.top - margin.bottom;
	var axisMargin = rMax/2 + 20;

	// generate a list of random x,y,z data
	var makeData = function() {
		// generate a random number scaled by `max`
		var rand = function(max) {return Math.random() * max;};

		var dataSet = [];
		for(var i=0; i<numData; i++) {
			dataSet.push({'x': rand(xMax), 'y': rand(yMax), 'z': rand(zMax)})
		}
		return dataSet;
	}

    // insert a new SVG chart
	var chart = d3.select('#chart')
        .append('svg')
		.attr({'class': 'svg-chart', 'width': outerWidth, 'height': outerHeight})

	// define axes
	var x = d3.scale.linear()
		.domain([0, xMax])
		.range([0, innerWidth])

	var y = d3.scale.linear()
		.domain([0, yMax])
		.range([0, innerHeight])

	var r = d3.scale.linear()
		.domain([0, zMax])
		.range([0, rMax])

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')
		.ticks(5)
		.innerTickSize(-(innerWidth + axisMargin*2))
		.tickPadding(10)

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('right')
		.ticks(5)
		.innerTickSize(-(innerWidth + axisMargin*2))
		.tickPadding(10)

	// add axes to chart
	chart.append('g')
		.attr('transform', 'translate('+ margin.left +','+ (margin.top + innerHeight + axisMargin) +')')
		.attr('class', 'x axis')
		.call(xAxis)

	chart.append('g')
		.attr('transform', 'translate('+ (margin.left + innerWidth + axisMargin) + ','+ margin.top +')')
		.attr('class', 'y axis')
		.call(yAxis)

	// add super cool title to the chart
	chart.append('g')
		.attr('transform', 'translate('+ margin.left/4 +','+ margin.top/2 +')')
        .append('text')
            .text('BUBBLE')
            .attr('x', innerWidth/2)
            .attr('y', 0)
            .attr('class', 'watermark')
            .attr('text-anchor', 'middle')

    chart.append('g')
		.attr('transform', 'translate('+ margin.left/4 +','+ margin.top/1.5 +')')
        .append('text')
            .text('Roll over SLOWLY to view values')
            .attr('x', innerWidth/2)
            .attr('y', 0)
            .attr('class', 'small watermark')
            .attr('text-anchor', 'middle')

	// add legend
	var legend = chart.append('g')
		.attr('transform', 'translate('+ (margin.left + innerWidth * 0.1) +',0)')
		.attr('class', 'legend')
		.selectAll('.legend-data')
		.data([{'x': 70, 'y': 10, 'z': 75},
			   {'x': 82, 'y': 10, 'z': 50},
			   {'x': 92, 'y': 10, 'z': 25}])
		.enter().append('g')
			.attr('class', 'bubble-group')

	legend.append('circle')
		.attr('class', 'bubble')
		.attr('cx', function(d) {return x(d.x)})
		.attr('cy', function(d) {return y(d.y)})
		.attr('r',  function(d) {return r(d.z)})

	legend.append('text')
		.text(function(d) {return (d.z).toFixed(2)})
		.attr('x', function(d) {return x(d.x - r(d.z)/4) - 5})
		.attr('y', function(d) {return y(d.y - r(d.z)/4) - 5})

	// add the actual graph
	var graph = chart.append('g')
		.attr('id', 'bubble-chart')
		.attr('transform', 'translate('+ margin.left +','+ margin.top +')')
		.selectAll('.bubble-group')
		.data(makeData())

	graph.enter().append('g')
		.attr('class', 'bubble-group')


	graph.append('circle')
		.attr('class', 'bubble')
		.attr('cx', function(d) {return x(d.x)})
		.attr('cy', function(d) {return y(d.y)})
		.attr('r',  function(d) {return r(d.z)})

	graph.append('text')
		.text(function(d) {return (d.z).toFixed(2)})
		.attr('x', function(d) {return x(d.x - r(d.z)/4) - 5})
		.attr('y', function(d) {return y(d.y - r(d.z)/4) - 5})
		.attr('class', 'hidden')	
})})()
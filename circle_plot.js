(function(){document.addEventListener("DOMContentLoaded", function(event) {

	var margin = {top: 100, bottom: 50, left: 100, right: 50};
	var outerWidth = 700, outerHeight = 700;
	var innerWidth = outerWidth - margin.left - margin.right;
	var innerHeight = outerHeight - margin.top - margin.bottom;
	var xMax = 150,
		yMax = 150,	
		rMax = 150,
		zMax = 100, 
		axisMargin = 0;
	var json = {"circles": [{"y": 88.83084010272643, "x": 147.26160342749924, "r": 52.26664411016598}, {"y": 87.49438713974133, "x": 168.48765170743096, "r": 83.04043569341464}, {"y": 137.55102040816325, "x": -626.530612244898, "r": 684.5106053570785}, {"y": 53.956043956043956, "x": 25.54945054945055, "r": 19.848782272734553}, {"y": 37.90944679421921, "x": -30.45276602890398, "r": 100.43807079177316}, {"y": 53.24675324675325, "x": 31.082251082251084, "r": 10.951610944306076}], "vendors": [{"y": 10, "x": 75, "name": "CC"}, {"y": 70, "x": 130, "name": "A1"}, {"y": 20, "x": 20, "name": "DEX"}, {"y": 50, "x": 30, "name": "LAV"}], "lines": [{"y1": -1000, "x2": 75.0, "x1": 75.0, "y2": 1000}, {"y1": -1050.9090909090908, "x2": 1102.5, "x1": -897.5, "y2": 1130.9090909090908}, {"y1": 196.8181818181818, "x2": 1047.5, "x1": -952.5, "y2": -166.8181818181818}, {"y1": 918.8888888888888, "x2": 1052.5, "x1": -947.5, "y2": -858.8888888888888}, {"y1": -1050.9090909090908, "x2": 1102.5, "x1": -897.5, "y2": 1130.9090909090908}, {"y1": -1000, "x2": 130.0, "x1": 130.0, "y2": 1000}, {"y1": -409.5454545454545, "x2": 1075.0, "x1": -925.0, "y2": 499.5454545454545}, {"y1": -140.0, "x2": 1080.0, "x1": -920.0, "y2": 260.0}, {"y1": 196.8181818181818, "x2": 1047.5, "x1": -952.5, "y2": -166.8181818181818}, {"y1": -409.5454545454545, "x2": 1075.0, "x1": -925.0, "y2": 499.5454545454545}, {"y1": -1000, "x2": 20.0, "x1": 20.0, "y2": 1000}, {"y1": -2965.0, "x2": 1025.0, "x1": -975.0, "y2": 3035.0}, {"y1": 918.8888888888888, "x2": 1052.5, "x1": -947.5, "y2": -858.8888888888888}, {"y1": -140.0, "x2": 1080.0, "x1": -920.0, "y2": 260.0}, {"y1": -2965.0, "x2": 1025.0, "x1": -975.0, "y2": 3035.0}, {"y1": -1000, "x2": 30.0, "x1": 30.0, "y2": 1000}], "trucks": [{"y": 2, "bags": 13, "x": 89}, {"y": 62, "bags": 4, "x": 62}, {"y": 15, "bags": 13, "x": 50}, {"y": 87, "bags": 5, "x": 80}, {"y": 83, "bags": 18, "x": 46}, {"y": 30, "bags": 9, "x": 91}, {"y": 21, "bags": 1, "x": 14}, {"y": 97, "bags": 8, "x": 77}, {"y": 86, "bags": 5, "x": 69}, {"y": 99, "bags": 8, "x": 99}]};

	d3.json('http://dev01.services.flycleaners.com/algorithms/GeoCluster', function(error, json) {

    // insert a new SVG chart
	var svg = d3.select('#circle-plot')
        .append('svg')
		.attr({'class': 'svg-chart border', 'width': outerWidth, 'height': outerHeight})

	// // define axes
	var x = d3.scale.linear()
		.domain([0, xMax])
		.range([0, innerWidth])

	var y = d3.scale.linear()
		.domain([0, yMax])
		.range([0, innerHeight])

	var r = d3.scale.linear()
		.domain([0, rMax])
		.range([0, innerHeight])

	// add the actual graph
	var graph = svg.append('g')
		.attr('id', 'circle-chart')
		.attr('class', 'border')
		.attr('transform', 'translate('+ margin.left +','+ margin.top +')')

	//////////// circles ////////////
	var circles = graph.selectAll('.circle-group')
		.data(json.circles)
		.enter().append('g')
		.attr('class', 'circle-group')
		.attr('transform', function(d) {return 'translate('+ x(d.x) +','+ y(d.y) +')';})

	circles.append('circle')
		.attr('r',  function(d) {return r(d.r)})

	///////////// vendors //////////
	var vendors = graph.selectAll('.vendor-group')
		.data(json.vendors)
		.enter().append('g')
		.attr('class', 'vendor-group')
		.attr('transform', function(d) {return 'translate('+ x(d.x) +','+ y(d.y) +')';})

	vendors.append('circle')
		.attr('r', r(2))

	vendors.append('text')
		.attr('x', 10)
		.attr('y', 10)
		.text(function(d) {return d.name})

	///////////// trucks //////////
	var trucks = graph.selectAll('.truck-group')
		.data(json.trucks)
		.enter().append('g')
		.attr('class', 'truck-group')
		.attr('transform', function(d) {return 'translate('+ x(d.x) +','+ y(d.y) +')';})

	trucks.append('rect')
		.attr('x', -5)
		.attr('y', -5)
		.attr('width', 10)
		.attr('height', 10)

	trucks.append('text')
		.attr('x', -5)
		.attr('y', -5)
		.text(function(d) {return d.bags})


	// add axes to chart
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('top')
		.ticks(5)
		.innerTickSize(-innerHeight)
		.tickPadding(10)


	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')
		.ticks(5)
		.innerTickSize(-innerWidth)
		.tickPadding(10)

	svg.append('g')
		.attr('transform', 'translate('+ margin.left + ','+ margin.top +')')
		.attr('class', 'y axis')
		.call(yAxis)

	svg.append('g')
		.attr('transform', 'translate('+ margin.left +','+ margin.top +')')
		.attr('class', 'x axis')
		.call(xAxis)

	// add super cool title to the chart
	svg.append('g')
		.attr('transform', 'translate('+ margin.left/4 +','+ margin.top/2 +')')
        .append('text')
            .text('scatter bubble plot')
            .attr('x', innerWidth/2)
            .attr('y', 0)
            .attr('class', 'watermark')
            .attr('text-anchor', 'middle')
            .style('fill', '#ddd')

	// add string
	d3.select('#text-string')
		.html(json.string)
	})

	
})})()
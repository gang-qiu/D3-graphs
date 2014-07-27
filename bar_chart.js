(function(){document.addEventListener("DOMContentLoaded", function(event) {
	var margin = {top: 80, bottom: 50, left: 50, right: 10};
	var outerWidth = 600, outerHeight = 400, dataMax = 100;
	var innerWidth = outerWidth - margin.left - margin.right;
	var innerHeight = outerHeight - margin.top - margin.bottom;

	var type = function(data) { 
		data.count = parseInt(data.count);
		return data;
	}

    // dummy data: letters and their count in a document
    var data = [];
    var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
    for (var i = 0; i < letters.length; i++) {
        var count = Math.floor(Math.random() * dataMax);
        data.push( {'letter': letters[i], 'count': count} );
    };

    // define scales and axes
	var x = d3.scale.ordinal()
		.domain(data.map(function(d) {return d.letter}))
		.rangeRoundBands([0, innerWidth], 0.1, 0.3);

	var y = d3.scale.linear()
		.domain([0, dataMax])
		.range([innerHeight, 0])

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')

    // chart element
	var chart = d3.select('#chart')
        .append('svg')
		.attr({'class': 'svg-chart', 'width': outerWidth, 'height': outerHeight})

    // define the `g` elements for the graph and 2 axes
    chart.append('g')
        .attr('transform', 'translate('+ margin.left +','+ margin.top +')')
        .attr('id', 'bar-graph')
        .append('text')
            .text('BAR')
            .attr('x', innerWidth/2)
            .attr('y', 0)
            .attr('class', 'watermark')
            .attr('text-anchor', 'middle')

    chart.append('g')
        .attr('transform', 'translate('+ margin.left +','+ (innerHeight + margin.top) +')')
        .attr('class', 'x axis')
        .call(xAxis)

    chart.append('g')
        .attr('transform', 'translate('+ margin.left +','+ margin.top +')')
        .attr('class', 'y axis')
        .call(yAxis)

    // add a `g` element to set the position for each bar
    d3.select('#bar-graph').selectAll('.bar')
        .data(data)
        .enter()
		.append('g')
            .attr('class', 'bar')
            .attr('transform', function(d,i) {return 'translate('+ x(d.letter) +',0)';})

    // set the svg `rect` element for each bar
	d3.selectAll('.bar')
        .append('rect')
			.attr('width',  x.rangeBand())
            .attr('height', function(d) {return innerHeight - y(d.count);})
            .attr('y',   	function(d) {return y(d.count);})

    // add an svg `text` element for each bar
    d3.selectAll('.bar')
        .append('text')
            .attr('x', x.rangeBand()/3)
            .attr('y', function(d) {return y(d.count) - 5})
            .text(function(d) {return d.count})


})})()
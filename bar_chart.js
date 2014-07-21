// 2153274647 - dad

(function(){document.addEventListener("DOMContentLoaded", function(event) {
	var margin = {top: 30, bottom: 50, left: 50, right: 10};
	var outerWidth = 600, outerHeight = 300; 
	var innerWidth = outerWidth - margin.left - margin.right;
	var innerHeight = outerHeight - margin.top - margin.bottom;

	var type = function(data) { 
		data.count = parseInt(data.count);
		return data;
	}

	d3.tsv('./data.tsv', type, function(data) {

		var x = d3.scale.ordinal()
			.domain(data.map(function(d) {return d.letter}))
			.rangeRoundBands([0, innerWidth], 0.1, 0.3);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {return d.count})])
			.range([innerHeight, 0])

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')

		var chart = d3.select('#svg-chart')
			.attr({'width': outerWidth, 'height': outerHeight})

        chart.append('g')
            .attr('transform', 'translate('+ margin.left +','+ margin.top +')')
            .attr('id', 'graph')

        chart.append('g')
            .attr('transform', 'translate('+ margin.left +','+ (innerHeight + margin.top) +')')
            .attr('class', 'x axis')
            .call(xAxis)

        chart.append('g')
            .attr('transform', 'translate('+ margin.left +','+ margin.top +')')
            .attr('class', 'y axis')
            .call(yAxis)

        d3.select('#graph').selectAll('.bar')
            .data(data)
            .enter()
			.append('g')
                .attr('class', 'bar')
                .attr('transform', function(d,i) {return 'translate('+ x(d.letter) +',0)';})

		d3.selectAll('.bar')
            .append('rect')
    			.attr('width',  x.rangeBand())
                .attr('height', function(d) {return innerHeight - y(d.count);})
                .attr('y',   	function(d) {return y(d.count);})

        d3.selectAll('.bar')
            .append('text')
                .attr('x', x.rangeBand()/3)
                .attr('y', function(d) {return y(d.count) - 5})
                .attr('class', 'hidden')
                .text(function(d) {return d.count})

	});  // tsv

})})()
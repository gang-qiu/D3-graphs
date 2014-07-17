(function(){
	var height = 500, width = 800, barSpace = 0,
		margin = {top: 20, right: 30, bottom: 30, left: 40}
		chartWidth = width  - margin.left - margin.right,
		chartHeight= height - margin.top  - margin.bottom

	var chart = d3.select('#svg-chart')
		.attr({'width':  width, 'height': height })
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

	var type = function(data) {
		data['Frequency'] = parseFloat(data['Frequency']);
		return data;
	}

	d3.tsv('./alphabet.tsv', type, function(data) {
		var barWidth = chartWidth / data.length;

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {return d['Frequency']})])
			.range([chartHeight, 0]);

		var x = d3.scale.ordinal()
			.domain(data.map(function(d) {return d['Letter']}))
			.rangeRoundBands([0, chartWidth], 0.1);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')

		bars = chart.selectAll('.bar')
			.data(data)
			.enter()
			// .append('g')
			// .attr('transform', function(d,i) {return 'translate(' + i*barSpace + ',30)'})

		bars.append('rect')
			.attr('class', 'bar')
			.attr({
				'width':  x.rangeBand(),
				'height': function(d,i) { return chartHeight - y(d['Frequency']); },
				'x':      function(d,i) { return x(d['Letter']); },
				'y':      function(d,i) { return y(d['Frequency']); }
			})

		chart.append('g')
				.attr({
					'class': 'x axis',
					'transform': 'translate(0,' + (chartHeight + 5) + ')',
				})
				.call(xAxis)

		chart.append('g')
				.attr('class', 'y axis')
				.call(yAxis)
			.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', 6)
				.attr('dy', '.711em')
				.style('text-anchor', 'end')
				.text('% Frequency')
	});
})()
(function(){
	var chartHeight = 400, chartWidth = 400, barSpace = 5;
	var chart = d3.select('#svg-chart');
	var type = function(data) {
		data['Frequency'] = parseFloat(data['Frequency']);
		return data;
	}

	d3.tsv('./alphabet.tsv', type, function(data) {
		var scale = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {return d['Frequency']})])
			.range([chartHeight, 0]);

		var barWidth = chartWidth / data.length;
		
		chart = chart.selectAll('g')
			.data(data)
			.enter()
			.append('g')
			.attr('transform', function(d,i) {return 'translate(' + i*barSpace + ',30)'})

		chart.append('rect')
			.attr({
				'width':  barWidth,
				'height': function(d,i) { return chartHeight - scale(d['Frequency']); },
				'x':      function(d,i) { return i*barWidth; },
				'y':      function(d,i) { return scale(d['Frequency']); }
			})

		chart.append('text')
			.attr({
				'x' : function(d,i) { return barWidth * (i + 0.5)-3; },
				'y' : chartHeight,
				'dy': '1em'
			})
			.text(function(d) {return d['Letter']});


	});
})()
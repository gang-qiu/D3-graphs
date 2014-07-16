(function(){
	var barHeight = 20, chartWidth = 400;

	var numerify = function(row) {
		row.value = parseInt(row.value);
		return row;
	};

	d3.tsv('./data.tsv', numerify, function(data) {
		var scale = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {return d.value})])
			.range([0, chartWidth]);

		var bars = d3.select('#svg-chart')
			.selectAll('g')
			.data(data)
			.enter()
			.append('g')
				.attr('transform', function(d,i) { return 'translate(0,' + i * barHeight + ')'})

		bars.append('rect')
			.attr({
				'x':      0,
				'y':      function(d,i) {return i * barHeight},
				'width' : function(d,i) {return scale(d.value)},
				'height': barHeight
			})

		bars.append('text')
			.attr({
				'x': function(d,i) {return scale(d.value)-20;},
				'y': function(d,i) {return i * barHeight;},
				'dy':15
			})
			.text(function(d) {return d.value})
	});

})();
// 2153274647 - dad

(function(){document.addEventListener("DOMContentLoaded", function(event) {
	var margin = {top: 30, bottom: 50, left: 50, right: 10};
	var outerWidth = 600, outerHeight = 200; 
	var innerWidth = outerWidth - margin.left - margin.right;
	var innerHeight = outerHeight - margin.top - margin.bottom;

	var type = function(data) { 
		data.count = parseInt(data.count);
		return data;
	}

	d3.tsv('./data.tsv', type, function(data) {
		var x = d3.scale.ordinal()
			.domain(data.map(function(d) {return d.letter}))
			.rangeRoundBands([0, innerWidth], 0.1, 0);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) {return d.count})])
			.range([innerHeight, 0]);

		var chart = d3.select('#svg-chart')
			.attr({'width': outerWidth, 'height': outerHeight})
			.selectAll('g').data(data).enter()
			.append('g')
				.attr('transform', function(d,i) {return 'translate('+ (margin.left+x(d.letter)) +',0)'; })

		chart.append('rect')
			.attr({
				'width':  x.rangeBand(),
				'height': function(d) {return innerHeight + margin.top - y(d.count);},
				'y': 	  function(d) {return margin.top + y(d.count);}
			});

        chart.append('text')
            .attr('x', x.rangeBand()/3)
            .attr('y', function(d) {return margin.top + y(d.count) - 5})
            .text(function(d) {return d.count})
	});


})})()
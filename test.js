(function(){

document.addEventListener("DOMContentLoaded", function(event) { 
	var barHeight = 20, chartWidth = 400;
	var data  = [4,2,6,2,7];

	var scale = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, chartWidth])

	d3.select('#chart')
		.selectAll('div')
		.data(data)
		.enter()
		.append('div')
			.text(function(d,i) {return d})
			.style({
				'width': function(d,i) {return scale(d) + 'px';},
				'height': barHeight + 'px'
			})

	var bars = d3.select('#svg-chart')
		.selectAll('g')
		.data(data)
		.enter().append('g')
		.attr('transform', function(d,i) {return 'translate(0,' + i * barHeight + ')';})
			
	bars.append('rect')
		.attr({
			'height': barHeight - 1,
			'width':  function(d) {return scale(d);}
		})
	
	bars.append('text')
		.attr({
			'x':  function(d) {return scale(d) - 15;},
			'y':  barHeight/2,
			'dy': '.35em'
		})
		.text(function(d) {return d;})
});

})()
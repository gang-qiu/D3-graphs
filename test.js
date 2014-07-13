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
			'width':  function(d,i) {return scale(d);}
		})
	
	bars.append('text')
		.attr({
			'x': function(d,i) {return scale(d)-3;}
			'y': barHeight/2.0 - 0.5;
		})

});

/*
<svg class="chart" width="420" height="120">
  <g transform="translate(0,0)">
    <rect width="40" height="19"></rect>
    <text x="37" y="9.5" dy=".35em">4</text>
  </g>
</svg>
*/

})()
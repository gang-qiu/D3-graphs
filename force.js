(function(){
var width = 500,
	height = 500;

var svg = d3.select('#force-plot')
	.append('svg')
		.attr('width', width)
		.attr('height', height)
		.style('border', '1px solid #000');

var link = svg.selectAll(".link")

var nodes = d3.range(10).map(function(i) {return {index: i};});

var force = d3.layout.force()
	.size([width, height])
	.on('tick', tick)
	.nodes(nodes)
	.charge(-30)
	.start();

var node = svg.selectAll(".node")
	.data(nodes)
	.enter().append("circle")
		.attr("class", function(d) {return d.index == 0 ? "branch" : "leaf"})
		.attr("cx", function(d) {return d.x;})
		.attr("cy", function(d) {return d.y;})
		.attr("r", 10)
		.call(force.drag)

function tick(e) {
	node.attr('cx', function(d) {return d.x})
		.attr('cy', function(d) {return d.y})
}

})();
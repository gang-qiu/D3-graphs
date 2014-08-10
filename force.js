(function(){

window.changeCols = function(num) {
	bins += ((bins + num) < 1 ? 0 : num);
	force.resume();
	reportCols();
}

window.reportCols = function() {
	d3.select('#totalCols').text(bins)
}

var width = 800,
	height = 600,
	padding = 20,
	bins = 3,
	spacing = 20,
	shakeVel = 30;
	
var svg = d3.select('#force-plot')
	.append('svg')
		.attr('width', width)
		.attr('height', height)
		.style('border', '1px solid #000')
		.on('click', shake);

var nodes = d3.range(200).map(function(i) {return {index: i, size: Math.random()*15 + 5};});

var force = d3.layout.force()
	.size([width, height])
	.on('tick', tick)
	.nodes(nodes)
	.charge(function(d) {return -d.size*2;})
	.start();

var node = svg.selectAll(".node")
	.data(nodes)
	.enter().append("circle")
		.attr("class", function(d) {return d.index == 0 ? "branch" : "leaf"})
		.attr("cx", function(d) {return d.x;})
		.attr("cy", function(d) {return d.y;})
		.attr("r", function(d) {return d.size;})
		.call(force.drag)

svg.style('opacity', 1e-6)
	.transition()
		.duration(500)
		.style('opacity', 1)

reportCols()

function shake() {
	nodes.forEach(function(n) {
		n.x += (Math.random() - 0.5)*shakeVel;
		n.y += (Math.random() - 0.5)*shakeVel;
	})
	force.resume();
}

function tick(e) {
	nodes.forEach(function(n,i) {
		n.x += group(i,[-spacing, spacing], bins)*e.alpha;
		bound(n);
	});


	node.attr('cx', function(d) {return d.x})
		.attr('cy', function(d) {return d.y})
}

function group(i, range, bins) {
	// returns a discrete mapping of `bins` parts over `range` values for `i` elements
	// group (0,[-20, 20], 5) -> -20
	// group (1,[-20, 20], 5) -> -10
	// group (2,[-20, 20], 5) ->   0
	// group (3,[-20, 20], 5) ->  10
	// group (4,[-20, 20], 5) ->  20

	if (bins <= 1) return 0;

	var span  = range[1] - range[0];
	var bin   = i % bins;
	var space = span / (bins - 1);
	return bin * space + range[0];
}

function bound(d) {
	if ((d.x+d.size) > width)  d.x = width - d.size;
	else if ((d.x-d.size) < 0) d.x = d.size;

	if ((d.y+d.size) > height)  d.y = height - d.size;
	else if ((d.y-d.size) < 0) d.y = d.size;
}

var columns = function() {
	return document.getElementById('columns').value;
}

})();
(function(){
var width = 1000,
height = 500,
padding = 20,
numNodes = 50,
nodeSize = 15,
nodeSizeMin = 5,
bins = 2,
spacing = 20,
shakeVel = 30;

window.reportCols = function() {
	d3.select('#totalCols').text(bins)
}

window.reportNodes = function() {
	d3.select('#totalNodes').text(nodes.length)
}
	
var svg = d3.select('#force-plot')
	.append('svg')
		.attr('width', width)
		.attr('height', height)
		.style('border', '1px solid #000')

var nodesInit = d3.range(numNodes).map(function(i) {return {size: randSize()};});

var force = d3.layout.force()
	.size([width, height])
	.on('tick', tick)
	.nodes(nodesInit)
	.charge(function(d) {return -d.size*2;})

var node = svg.selectAll(".node"),
	nodes = force.nodes();

svg.style('opacity', 1e-6)
	.transition()
		.duration(1000)
		.style('opacity', 1);

restart();
reportCols();

//---------------------

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

function randSize() {
	return Math.random()*nodeSize + nodeSizeMin;
}

var columns = function() {
	return document.getElementById('columns').value;
}

//--------------

window.changeCols = function(num) {
	bins += ((bins + num) < 1 ? 0 : num);
	force.resume();
	reportCols();
}

window.shake = function() {
	nodes.forEach(function(n) {
		n.x += (Math.random() - 0.5)*shakeVel;
		n.y += (Math.random() - 0.5)*shakeVel;
	})
	force.resume();
}

window.addNodes = function(amt) {
	if (amt > 0) {
		for (var i=0; i<amt; i++) {
			nodes.push({size: randSize()});
		}
	}
	else nodes.splice(Math.max(nodes.length+amt-1, 0), -amt);

	restart();
}

function restart() {
	node = node.data(nodes);

	node.exit().remove();

	node.enter().append("circle")
		.attr("class", "node")
		.attr("r", function(d) {return d.size;})
		.call(force.drag);

	force.start();
	reportNodes();
}

})();
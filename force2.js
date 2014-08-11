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

// window.reportCols = function() {
// 	d3.select('#totalCols').text(bins)
// }

// window.reportNodes = function() {
// 	d3.select('#totalNodes').text(nodes.length)
// }
	
var svg = d3.select('#force2-plot')
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
	// reportCols();
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
	// reportNodes();
}

function generateIncidents(numIncidents) {
	var incidents = [];
	for (var i=0; i<numIncidents; i++) {
		incidents.push(randomIncident())
	}
	return incidents;
}

function randomIncident() {
	return {
		severity: randomAttr('severity'),
		type: randomAttr('type'),
		dateCreated: randomAttr('dateCreated'),
		assignee: randomAttr('assignee'),
		message: randomAttr('message')
	}
}

function randomAttr(incidentAttr) {
	var incidents = {
		severity: [1,2,3,4],
		type: ['Zendesk', 'Twitter', 'Dispatch', 'Calendar'],
		dateCreated: [
			'01-02-2014', '01-03-2014', '01-04-2014', '01-05-2014', '01-06-2014', '01-07-2014',
			'02-02-2014', '02-03-2014', '02-04-2014', '02-05-2014', '02-06-2014', '02-07-2014',
			'03-02-2014', '03-03-2014', '03-04-2014', '03-05-2014', '03-06-2014', '03-07-2014',
			'04-02-2014', '04-03-2014', '04-04-2014', '04-05-2014', '04-06-2014', '04-07-2014'
		],
		assignee: ['Davon', 'Athena', 'Diana', 'Katelyn', 'Clayton', 'David', 'Eric', 'Unassigned'],
		message: ['Lorem ipsum dolor sit amet', 'Consectetur adipisicing elit', 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua']
	};
	var incident = incidents[incidentAttr];
	return incident[parseInt(Math.random()*incident.length)];
}
debugger
})();
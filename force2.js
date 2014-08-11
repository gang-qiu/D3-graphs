(function(){
var width = 1000,
height = 500,
padding = 20,
numNodes = 50,
nodeSize = 10,
nodeSizeMin = 5,
bins = 1,
spacing = 20,
shakeVel = 30,
groupChoice = null,
colorChoice = null,
sizeChoice  = 'severity';

// window.reportCols = function() {
// 	d3.select('#totalCols').text(bins)
// }

// window.reportNodes = function() {
// 	d3.select('#totalNodes').text(nodes.length)
// }

var incidents = {
	severity: [1,2,3,4,5],
	type: ['Zendesk', 'Twitter', 'Dispatch', 'Calendar'],
	days: [1,2,3,4,5],
	assignee: ['Davon', 'Athena', 'Diana', 'Katelyn', 'Clayton', 'Unassigned'],
	message: ['Lorem ipsum dolor sit amet', 'Consectetur adipisicing elit', 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua']
};

var nodesInit = generateIncidents(numNodes),
    colorScale = d3.scale.category10();

var svg = d3.select('#force2-plot')
	.append('svg')
		.attr('width', width)
		.attr('height', height)
		.style('border', '1px solid #000')

var force = d3.layout.force()
	.size([width, height])
	.on('tick', tick)
	.nodes(nodesInit)
	.charge(function(d) {return -r(d)*r(d)/8;})

var node = svg.selectAll(".node"),
	nodes = force.nodes()

svg.style('opacity', 1e-6)
	.transition()
		.duration(1000)
		.style('opacity', 1);

restart();
console.log(nodes)

//---------------------

function tick(e) {
	nodes.forEach(function(n,i) {
		setColumns(n, e);
		bound(n);
	});

	node.attr('cx', function(d) {return d.x})
		.attr('cy', function(d) {return d.y})
}

// function group(i, range, bins) {
// 	// returns a discrete mapping of `bins` parts over `range` values for `i` elements
// 	// group (0,[-20, 20], 5) -> -20
// 	// group (1,[-20, 20], 5) -> -10
// 	// group (2,[-20, 20], 5) ->   0
// 	// group (3,[-20, 20], 5) ->  10
// 	// group (4,[-20, 20], 5) ->  20

// 	if (bins <= 1) return 0;
// 	var span  = range[1] - range[0];
// 	var bin   = i % bins;
// 	var space = span / (bins - 1);
// 	return bin * space + range[0];
// }

function bound(d) {
	if ((d.x+r(d)) > width)  d.x = width - r(d);
	else if ((d.x-r(d)) < 0) d.x = r(d);

	if ((d.y+r(d)) > height)  d.y = height - r(d);
	else if ((d.y-r(d)) < 0) d.y = r(d);
}

var columns = function() {
	return document.getElementById('columns').value;
}

//--------------

window.shake = function() {
	nodes.forEach(function(n) {
		n.x += (Math.random() - 0.5)*shakeVel;
		n.y += (Math.random() - 0.5)*shakeVel;
	})
	force.resume();
}

window.colorCat = function(color) {
	colorChoice = color.value;
	restart();
	updateColorLegend();
	node.transition()
		.duration(1000)
		.style('fill', function(d) {return colorScale(d[colorChoice])})
}

window.groupCat = function(group) {
	groupChoice = group.value;
	console.log(groupChoice)
	updateGroups();
	restart();
}

window.sizeCat = function(size) {
	sizeChoice = size.value;
	restart();
	node.transition()
		.duration(1000)
		.attr('r', function(d) {return r(d)})
}

function restart() {
	node = node.data(nodes);

	node.exit().remove();

	node.enter().append("circle")
		.attr("class", "node")
		.attr("r", function(d) {return r(d);})
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
		days: randomAttr('days'),
		assignee: randomAttr('assignee'),
		message: randomAttr('message')
	}
}

function randomAttr(incidentAttr) {
	var incident = incidents[incidentAttr];
	return incident[parseInt(Math.random()*incident.length)];
}

function r(dataNode) {
	return dataNode[sizeChoice]*nodeSize;
}

function updateColorLegend() {
	d3.select('#force2-plot fieldset').remove()
	var legend = d3.select('#force2-plot div.clearfix').append('fieldset')

	legend.append('legend').text('Colors: '+ colorChoice)
	var items = incidents[colorChoice];
	var item = legend.selectAll('p')
		.data(items)
		.enter().append('p')

	item.insert('span')
		.attr('class', 'legend-item')
		.style('background-color', function(d) {return colorScale(d)})

	item.append('span').text(function(d) {return '     '+ d})
};

function oScale(group) {
	return d3.scale.ordinal()
		.domain(group)	
		.rangePoints([-spacing, spacing])
};

function updateGroups() {
	
	// incidents[groupChoice].forEach(function(i) {
	// 	console.log(o(i))
	// })
};

function setColumns(dataNode, event) {
	if (groupChoice) {
		var o = oScale(incidents[groupChoice]);
		dataNode.x += event.alpha * o(dataNode[groupChoice])
	}
};

})()
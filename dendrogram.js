(function(){
	var width = 700, height = 400, padding = 50;
	var data = {"name": "flare", "children": [{"name": "analytics", "children": [{"name": "cluster", "children": [{"name": "AgglomerativeCluster", "size": 3938}, {"name": "CommunityStructure", "size": 3812}, {"name": "MergeEdge", "size": 743} ] }, {"name": "graph", "children": [{"name": "BetweennessCentrality", "size": 3534}, {"name": "LinkDistance", "size": 5731} ] } ] } ] };

	var svg = d3.select('#dendrogram-graph')
		.append('svg')
			.attr('width',  width)
			.attr('height', height)

	var graph = svg.append('g')
		.attr('transform', 'translate(0,'+ padding + ')')
		.attr('class', 'dendrogram')

	var dendo = d3.layout.cluster()
		.size([width-padding*2, height-padding*3])							// size of dendrogram plot
		.sort(function(a,b) {return d3.ascending(a.name, b.name);})			// sort sibling nodes 
		.separation(function(a,b) {return (a.parent == b.parent ? 1:2);})   // space ratio between siblings : cousins

	var nodes = dendo.nodes(data);
	var links = dendo.links(nodes);

	graph.selectAll('path')
		.data(links)
		.enter().append('path')
			.attr('d', d3.svg.diagonal())
			.attr('class', 'line')

	graph.selectAll('circle')
		.data(nodes)
		.enter().append('circle')
			.attr('cx',function(d) {return d.x;})
			.attr('cy',function(d) {return d.y;})
			.attr('r', 10)
			.style('fill', 'red')

	var labels = graph.selectAll('text')
		.data(nodes)
		.enter().append('text')
			.attr('x', function(d) {return d.x + 25})
			.attr('y', function(d) {return d.y + 5})
			.attr('transform', function(d) {return 'rotate(20 '+ d.x +','+ d.y +')'})
			.text(function(d) {return d.name;})

	svg.append('text')
            .text('Tree Plot!')
            .attr('x', width/4)
            .attr('y', 80)
            .attr('class', 'watermark')
            .attr('text-anchor', 'middle')

})();

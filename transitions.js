(function(){
	var width = 700, height = 300, padding = 50
	var nums = ['A', 'J', 'Q', 'K']
	var suits = {'spade': '\u2660', 'heart': '\u2665', 'club':  '\u2663', 'diamond': '\u2666'};
	var cards = orderedCards();

	// make ordered list of cards
	function orderedCards() {
		var cards = [], pos = 0;
		for (var suit in suits) {
			nums.forEach(function(num) {
				var color = (suit === 'spade' || suit === 'club' ? 'black' : 'red')
				cards.push({'pos': pos, 'new_pos': pos, 'num': num, 'suit': suits[suit], 'color': color})
				pos++;
			});
		}
		return cards;
	}

	// set card position according to `order`, an array of indices
	function setCards (order) {
		// later, we should be able to set the `new_pos` attr for each card..
		animateCards(order);
	}

	// animate the shuffling of cards
	function animateCards (order) {
		cardz.transition()
			.duration(2100)
			.attr('x', function(d,i) {return d.pos * 40 + 'px';})
		.transition()
			.attr('y', function(d,i) {return order[i] * 20+'px'})
		.transition()
			.attr('x', 0)
	}

	// create the svg element
	var svg = d3.select('#cards')
		.append('svg')
			.attr('width', width + padding * 2)
			.attr('height', height + padding * 2)

	// render the ordered cards list
	var cardz = svg.append('g')		
			.attr('transform', 'translate('+ padding +','+ padding +')')
		.selectAll('text')
		.data(cards)
		.enter().append('text')
			.attr('class', 'card')
			.attr('x', 0)
			.attr('y', function(d,i) {return d.pos * 20+'px';})
			.text(function(d){return d.suit + ' ' + d.num;})
			.style('stroke', function(d) {return d.color;})
			.style('fill', function(d) {return d.color;})

	// event handlers for the shuffle and reset buttons
	d3.select('#shuffle-cards')
		.on('click', function() {
			// make a random list of indices
			setCards(d3.shuffle(d3.range(cards.length)));	
		})

	d3.select('#reset-cards')
		.on('click', function() {
			// make an order list of indices
			setCards(d3.range(cards.length));
		})

})();
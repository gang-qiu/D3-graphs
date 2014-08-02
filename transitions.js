(function(){
	var makeCards = function() {
		var suits = {'spade': '\u2660', 'heart': '\u2665', 'club':  '\u2663', 'diamond': '\u2666'};
		var nums = ['A', 'J', 'Q', 'K'], cards = [], pos = 0;
		for (var suit in suits) {
			nums.forEach(function(num) {
				var color = (suit === 'spade' || suit === 'club' ? 'black' : 'red')
				cards.push({'pos': pos++, 'num': num, 'suit': suits[suit], 'color': color})
			});
		}
		return cards
	}

	var shuffle = function(cards) {
		shuffledCards = [];
		while (cards.length > 0) {
			
			shuffledCards.push(cards.splice(Math.floor(Math.random() * (cards.length))))
		}
		return shuffledCards;
	}

	console.log(shuffle(makeCards()))

	var width = 400, height = 300, padding = 50;
	var cards = makeCards();

	d3.select('#cards')
		.append('svg')
			.attr('width', width + padding * 2)
			.attr('height', height + padding * 2)
		
	svg = d3.select('#cards svg')

	svg.append('g')		
			.attr('transform', 'translate('+ padding +','+ padding +')')
		.selectAll('text')
		.data(cards)
		.enter().append('text')
			.attr('x', 0)
			.attr('y', function(d,i) {return i*20+'px'})
			.text(function(d){return d.suit + ' ' + d.num})
			.style('stroke', function(d) {return d.color})
			.style('fill', function(d) {return d.color})



})();
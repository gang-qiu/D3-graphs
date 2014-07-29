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
		window._cards = cards;
	}

	var shuffleCards = function() {
		var shuffledCards = [], nums = [];
		for (var i=0; i<_cards.length; i++) {nums.push(i);}
		while (nums.length > 0) {
			var i = Math.floor(Math.random() * nums.length);
			var j = nums.splice(i,1)[0];
			shuffledCards.push(_cards[j]);
		}
		_cards = shuffledCards;
	}

	var width = 400, height = 300, padding = 50;

	d3.select('#cards')
	.append('svg')
		.attr('width', width + padding * 2)
		.attr('height', height + padding * 2)

	var svg = d3.select('#cards svg');

	function shuffle() {
		shuffleCards();

		svg.transition().duration(1000).selectAll('.card')
			.attr('y', function(d,i) {return 20+i*20 + 'px';})
	};

	makeCards();

	svg.append('g')		
			.attr('transform', 'translate('+ padding +','+ padding +')')
		.selectAll('text')
		.data(_cards)
		.enter().append('text')
			.attr('x', 0)
			.attr('y', function(d,i) {return i*20+'px';})
			.attr('class', 'card')
			.text(function(d){return d.suit + ' ' + d.num;})
			.style('stroke', function(d) {return d.color;})
			.style('fill', function(d) {return d.color;})

	shuffle();
})();
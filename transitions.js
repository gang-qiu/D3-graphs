(function(){
	var makeCards = function() {
		var suits = {'spade': '&#9824;', 'heart': '&#9829;', 'club':  '&#9830;', 'diamond': '&#9827;'};
		var nums = ['A', 'J', 'Q', 'K'], cards = [], pos = 0;
		for (var suit in suits) {
			nums.forEach(function(num) {
				var color = (suit === 'spade' || suit === 'club' ? 'black' : 'red')
				cards.push({'pos': pos++, 'num': num, 'suit': suit, 'color': color})
			});
		}
		return cards
	}

	console.log(makeCards())
	
})();
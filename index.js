window.onload = function () {
	//EXRATES.converter.getExRates('latest.json');
	var a = new RatesWidget('first','container');
	a.getExRates();
	
	var b = new RatesWidget('second','second');
	b.getExRates();
	
	var c = new RatesWidget('third','third');
	c.getExRates();
};
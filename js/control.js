var Controller = (function(){

	var map;

	function initialize() {
		map = new Map('map');

		setTimeout(function(){
			$('h1')[0].addClass('hide');
		}, 2000);
	}

	var controller = function() {};
	controller.prototype.initialize = initialize;
	return new controller();
})();

window.onload = Controller.initialize;
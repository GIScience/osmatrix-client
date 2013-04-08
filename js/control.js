var Controller = (function(){

	var map;

	/**
	 * [initialize description]
	 */
	function initialize() {
		var permaLink = Permalink.parse(document.URL);

		map = new Map('map');
		if (permaLink) map.moveTo(permaLink.lonlat, permaLink.zoom);
		
		map.register('layer:loadStart', handleMapLoadStart);
		map.register('layer:loadEnd', handleMapLoadEnd);
		map.register('map:moved', handleMapMove);

		$('.tool > button').click(handleButtonClick);

		setTimeout(function() {
			$('h1').addClass('hide');
		}, 5000);
	}

	/**
	 * [handleMapLoadStart description]
	 * @return {[type]} [description]
	 */
	function handleMapLoadStart() {
		$('#layer button').addClass('loading');
		$('#layer .spinner').addClass('loading');
	}

	/**
	 * [handleMapLoadEnd description]
	 * @return {[type]} [description]
	 */
	function handleMapLoadEnd() {
		$('#layer button').removeClass('loading');
		$('#layer .spinner').removeClass('loading');
	}

	function handleMapMove(mapState) {
		Permalink.update(mapState.zoom, mapState.lon, mapState.lat);
	}

	function handleButtonClick() {
		$(this).toggleClass('active');
		$(this).siblings('.content').toggleClass('active');
		
	}

	var controller = function() {};
	controller.prototype.initialize = initialize;
	return new controller();
})();

window.onload = Controller.initialize;
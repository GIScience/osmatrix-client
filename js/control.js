var Controller = (function(){

	var map;

	var permalink;

	/**
	 * [initialize description]
	 */
	function initialize() {
		map = new Map('map');
		map.register('layer:loadStart', handleMapLoadStart);
		map.register('layer:loadEnd', handleMapLoadEnd);

		setTimeout(function() {
			$('h1').addClass('hide');
		}, 5000);
	}

	/**
	 * [handleMapLoadStart description]
	 * @return {[type]} [description]
	 */
	function handleMapLoadStart() {
		$('#layer').addClass('loading');
		$('#layer .spinner').addClass('loading');
	}

	/**
	 * [handleMapLoadEnd description]
	 * @return {[type]} [description]
	 */
	function handleMapLoadEnd() {
		$('#layer').removeClass('loading');
		$('#layer .spinner').removeClass('loading');
	}

	var controller = function() {};
	controller.prototype.initialize = initialize;
	return new controller();
})();

window.onload = Controller.initialize;
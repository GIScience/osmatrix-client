var Map = (function() {

	/**
	 * Constructor
	 * @param  {[type]} container [description]
	 */
	function map(container) {
		var _self = this;

		var theMap = L.map(container).setView([51.505, -0.09], 13);

		var tiledLayer = new L.StamenTileLayer("toner-lite");
		theMap.addLayer(tiledLayer);

		var matrixLayer = L.tileLayer('http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/map/totalNumbOfPOIs/diff/{z}/{x}/{y}?start=2&end=4', {
    		maxZoom: 18
		});
		theMap.addLayer(matrixLayer);

		matrixLayer.on('loading', function() {_self.emit('layer:loadStart')});
		matrixLayer.on('load', function() {_self.emit('layer:loadEnd')});
	}

	map.prototype = new EventEmitter();
	map.prototype.constructor = map;

	return map;
})();
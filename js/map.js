var Map = (function() {

	/**
	 * Constructor
	 * @param  {[type]} container [description]
	 */
	function map(container) {
		var self = this;

		/**
		 * [emitMapMoveEvent description]
		 */
		function emitMapMoveEvent() {
			self.emit('map:moved', {
				zoom: self.theMap.getZoom(),
				lat: self.theMap.getCenter().lat,
				lon: self.theMap.getCenter().lng
			});
		}

		/**
		 * [emitLayerLoadEvent description]
		 */
		function emitLayerLoadStartEvent() {
			self.emit('layer:loadStart');
		}

		/**
		 * [emitLayerLoadEndEvent description]
		 */
		function emitLayerLoadEndEvent() {
			self.emit('layer:loadEnd');
		}


		this.theMap = L.map(container).setView([51.505, -0.09], 13);

		var tiledLayer = new L.StamenTileLayer("toner-lite");
		this.theMap.addLayer(tiledLayer);

		this.theMap.on('zoomend', emitMapMoveEvent);
		this.theMap.on('moveend', emitMapMoveEvent);

		// var matrixLayer = L.tileLayer('http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/map/totalNumbOfPOIs/diff/{z}/{x}/{y}?start=2&end=4', {
		// 	maxZoom: 18
		// });
		// _self.theMap.addLayer(matrixLayer);

		// matrixLayer.on('loading', function() {_self.emit('layer:loadStart')});
		// matrixLayer.on('load', function() {_self.emit('layer:loadEnd')});
	}

	function moveTo(lonlat, zoom) {
		if (lonlat) this.theMap.panTo(lonlat);
		if (zoom) this.theMap.setZoom(zoom);
	}

	map.prototype = new EventEmitter();
	map.prototype.constructor = map;
	map.prototype.moveTo = moveTo;

	return map;
})();
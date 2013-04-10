var Map = (function () {

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

		/**
		 * [handleLayerAddEvent description]
		 */
		function handleLayerAddEvent(e) {
			e.layer.on('loading', emitLayerLoadStartEvent);
			e.layer.on('load', emitLayerLoadEndEvent);
		}


		this.theMap = L.map(container).setView([51.505, -0.09], 13);

		this.theMap.on('zoomend', emitMapMoveEvent);
		this.theMap.on('moveend', emitMapMoveEvent);
		this.theMap.on('layeradd', handleLayerAddEvent);

		var tiledLayer = new L.StamenTileLayer("toner-lite");
		this.theMap.addLayer(tiledLayer);
        
        var matrixLayer = L.tileLayer('http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/map/totalNumbOfPOIs/diff/{z}/{x}/{y}?start=2&end=4', {
            maxZoom: 18
		});
		this.theMap.addLayer(matrixLayer);
	}

	function moveTo(lonlat, zoom) {
		if (lonlat) {this.theMap.panTo(lonlat); }
		if (zoom) {this.theMap.setZoom(zoom); }
	}

	function addMatrixLayer() {
		
	}

	map.prototype = new EventEmitter();
	map.prototype.constructor = map;
	map.prototype.moveTo = moveTo;

	return map;
}());
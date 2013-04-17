var Map = (function () {
    "use strict";

    var MAP_URL = "http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/map/",
        MODE = {
            timestamp: 1,
            diff: 2
        };

	/**
	 * Constructor
	 * @param  {[type]} container [description]
	 */
	function map(container) {
		var self = this;

		/**
		 * [emitMapChangedEvent description]
		 */
		function emitMapChangedEvent(e) {
			self.emit('map:changed', {
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


		this.theMap = L.map(container, {zoomControl: false}).setView([51.505, -0.09], 13);

		var tiledLayer = new L.StamenTileLayer("toner-lite");
		this.theMap.addLayer(tiledLayer);

		this.theMap.on('zoomend', emitMapChangedEvent);
		this.theMap.on('moveend', emitMapChangedEvent);
		this.theMap.on('layeradd', handleLayerAddEvent);
	}

	/**
	 * [moveTo description]
	 * @param  {[type]} lonlat [description]
	 * @param  {[type]} zoom   [description]
	 */
	function moveTo(lonlat, zoom) {
		if (lonlat) {this.theMap.panTo(lonlat); }
		if (zoom) {this.theMap.setZoom(zoom); }
	}

	function updateMatrixLayer(mode, layer, times) {
		var layerUrl, mapMode;

		if (MODE[mode] === MODE.timestamp) {
			mapMode = 'timestamp';
			layerUrl = MAP_URL + layer + '/timestamp/' + times[0] + '/{z}/{x}/{y}';
		} else {
			mapMode = 'diff';
			layerUrl = MAP_URL + layer + '/diff/{z}/{x}/{y}?start=' + times[0] + '&end=' + times[1];
		}


		if (this.matrixLayer) {this.theMap.removeLayer(this.matrixLayer); }
		this.matrixLayer = L.tileLayer(layerUrl, {
            maxZoom: 18
		});
		this.theMap.addLayer(this.matrixLayer);

		this.emit('map:changed', {
			mode: mapMode,
			layer: layer,
			times: times,
			zoom: this.theMap.getZoom(),
			lat: this.theMap.getCenter().lat,
			lon: this.theMap.getCenter().lng
		});
	}

	map.prototype = new EventEmitter();
	map.prototype.constructor = map;
	map.prototype.moveTo = moveTo;
	map.prototype.updateMatrixLayer = updateMatrixLayer;
	map.prototype.MODE = MODE;

	return map;
}());
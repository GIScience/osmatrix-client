var Map = (function () {
    "use strict";

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
        
        function emitUserClickEvent(e) {
            self.emit('user:click', e.latlng);
        }


		this.theMap = L.map(container, {zoomControl: false}).setView([51.505, -0.09], 13);

		var tiledLayer = new L.StamenTileLayer("toner-lite");
		this.theMap.addLayer(tiledLayer);

		this.theMap.on('zoomend', emitMapChangedEvent);
		this.theMap.on('moveend', emitMapChangedEvent);
		this.theMap.on('layeradd', handleLayerAddEvent);
        this.theMap.on('click', emitUserClickEvent);
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

	function updateMatrixLayer(mode, layerUrl) {
		if (this.matrixLayer) {this.theMap.removeLayer(this.matrixLayer); }
		this.matrixLayer = L.tileLayer(layerUrl, {
            maxZoom: 18
		});
		this.theMap.addLayer(this.matrixLayer);

		this.emit('map:changed', {
			mode: mode.mode,
			layer: mode.layer,
			times: mode.times,
			zoom: this.theMap.getZoom(),
			lat: this.theMap.getCenter().lat,
			lon: this.theMap.getCenter().lng
		});
	}
    
    function updateFeatureInfoLayer(features) {
        if (this.featureInfoLayer) {this.theMap.removeLayer(this.featureInfoLayer); }
        
        this.featureInfoLayer = L.geoJson();
        this.theMap.addLayer(this.featureInfoLayer);
        
        for (var i = 0, len = features.result.length; i < len; i++) {
            console.log(JSON.stringify({"type": "Feature", "properties": {}, "geometry": features.result[i].geometry}));
//            this.featureInfoLayer.addData({"type": "Feature", "geometry": features.result[i].geometry});
            
        }
        
        
    }

	map.prototype = new EventEmitter();
	map.prototype.constructor = map;
	map.prototype.moveTo = moveTo;
	map.prototype.updateMatrixLayer = updateMatrixLayer;
    map.prototype.updateFeatureInfoLayer = updateFeatureInfoLayer;

	return map;
}());
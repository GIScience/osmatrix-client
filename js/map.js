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

		this.theMap = L.map(container, {
            center: [51.505, -0.09],
            zoom: 13,
            minZoom: 3,
            maxZoom: 12,
            maxBounds: new L.LatLngBounds(new L.LatLng(34.66682, -10.53538), new L.LatLng(61.07390, 38.00957)),
            zoomControl: false
        });

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
        this.updateFeatureInfoLayer(); 
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
    
    function updateFeatureInfoLayer(features, colors) {
        if (this.featureInfoLayer) {this.theMap.removeLayer(this.featureInfoLayer); }
        
        if (features && colors) {
            this.featureInfoLayer = L.geoJson(null, {
                style: function (feature) {
                    return {
                        fillColor: feature.properties.color,
                        fillOpacity: 0.7,
                        color: 'white',
                        opacity: 1,
                        weight: 2
                    };
                }
            });
            this.theMap.addLayer(this.featureInfoLayer);
            
            for (var i = 0, len = features.result.length; i < len; i++) {
                var color = colors[i];
                this.featureInfoLayer.addData({"type": "Feature", "properties": {"color": color}, "geometry": features.result[i].geometry});
            }
        }
    }

	map.prototype = new EventEmitter();
	map.prototype.constructor = map;
	map.prototype.moveTo = moveTo;
	map.prototype.updateMatrixLayer = updateMatrixLayer;
    map.prototype.updateFeatureInfoLayer = updateFeatureInfoLayer;

	return map;
}());
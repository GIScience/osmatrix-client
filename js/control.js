var Controller = (function ($) {
    'use strict';
    
	var map;
    
    // remove this
    var TOOLS = {
		geolocate: 'geolocate',
		layer: 'layer',
		geocode: 'searchPlace'
	};
    
    function handleGeolocationRequest() {
        Geolocator.locate(handleGeolocateSuccess, handleGeolocateError, handleGeolocateNoSupport);
    }
    
    function handleGeocodeRequest(address) {
        Geocoder.find(address, handleGeocodeResults);
    }
    
    function handleGeocodeLink(link) {
        var permaLinkState = Permalink.parse(link);
        map.moveTo([permaLinkState.lat, permaLinkState.lng]);
    }
    
    function handleLayerUpdate(layerInfo) {
        OSMatrix.getLegend(layerInfo.mode, layerInfo.layer, handleLegend);
        map.updateMatrixLayer(layerInfo, OSMatrix.getLayerUrl(layerInfo.mode, layerInfo.layer, layerInfo.times));
    }
    
    function handleMatrixCapabilities(capabilities) {
        Ui.initializeLayerSwitcher(capabilities);
        initializeTheMap();
    }
    
    function handleLegend(results) {
        Ui.updateLegend(results);
    }
    
    function handleGeocodeResults(results) {
        Ui.updateGeocodeResultList(document.URL, results);
	}
    
    function initializeTheMatrix() {
        OSMatrix.getCapabilities(handleMatrixCapabilities);
    }
    
	function handleMapLoadStart() {
		Ui.setLoadingState(true, TOOLS.layer);
	}

	function handleMapLoadEnd() {
		Ui.setLoadingState(false, TOOLS.layer);
	}

	function handleMapChanged(mapState) {
		Permalink.update(mapState.mode, mapState.layer, mapState.times, mapState.zoom, mapState.lon, mapState.lat);
	}

	/**
	 * [initialize description]
	 */
	function initialize() {
		map = new Map('map');

		map.register('layer:loadStart', handleMapLoadStart);
		map.register('layer:loadEnd', handleMapLoadEnd);
		map.register('map:changed', handleMapChanged);
        
        Ui.register('ui:geolocationRequest', handleGeolocationRequest);
        Ui.register('ui:geocodeRequest', handleGeocodeRequest);
        Ui.register('ui:geocodeLinkClick', handleGeocodeLink);
        Ui.register('ui:layerUpdate', handleLayerUpdate);

		initializeTheMatrix();
	}
    
	/**
	 * [setInitialMapLocation description]
	 */
	function initializeTheMap() {
		var permaLink = Permalink.parse(document.URL);
		if (permaLink) {map.moveTo([permaLink.lat, permaLink.lng], permaLink.zoom); }
            else {handleGeolocationRequest(); }
        
        Ui.setLayerSwitcherToMode(permaLink);
    }
    
    
    
    
    

	/**
	 * [handleGeolocateSuccess description]
	 * @param  {[type]} position [description]
	 * @return {[type]}          [description]
	 */
	function handleGeolocateSuccess(position) {
		map.moveTo([position.coords.latitude, position.coords.longitude]);
		Ui.stopGeolocation();
	}

	/**
	 * [handleGeolocateError description]
	 * @param  {[type]} error [description]
	 * @return {[type]}       [description]
	 */
	function handleGeolocateError(error) {
		switch (error.code) {
            case error.UNKNOWN_ERROR:
                Ui.stopGeolocation('The location acquisition process failed');
                break;
            case error.PERMISSION_DENIED:
                Ui.deactivateGeolocation();
                break;
            case error.POSITION_UNAVAILABLE:
                Ui.stopGeolocation('The position of the device could not be determined. One or more of the location providers used in the location acquisition process reported an internal error that caused the process to fail entirely.');
                break;
            case error.TIMEOUT:
                Ui.stopGeolocation('The location acquisition timed out');
                break;
        }
	}

	/**
	 * [handleGeolocateNoSupport description]
	 */
	function handleGeolocateNoSupport() {
		Ui.deactivateGeolocation('Geolocation API is not supported by your browser.');
	}
    

	var controller = function() {};
	controller.prototype.initialize = initialize;
	return new controller();
}(jQuery));

window.onload = Controller.initialize;
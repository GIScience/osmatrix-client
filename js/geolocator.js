var Geolocator = (function (w) {
    "use strict";
    
	/**
	 * Constructor
	 */
	function Geolocator() {
		
	}

	function locate(locationSuccess, locationError, locationNotSupported) {
		if (w.navigator.geolocation) {w.navigator.geolocation.getCurrentPosition(locationSuccess, locationError); } else {locationNotSupported(); }
	}

	Geolocator.prototype.locate = locate;

	return new Geolocator();
}(window));
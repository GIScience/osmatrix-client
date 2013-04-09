var Geolocator = (function() {
	var INSTANCE;

	/**
	 * Constructor
	 */
	function geolocator() {
		if (!INSTANCE) INSTANCE = this;
	}

	function locate(locationSuccess, locationError, locationNotSupported) {
		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
		else locationNotSupported();
	}

	geolocator.prototype.locate = locate;

	return new geolocator();
})();
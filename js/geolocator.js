var Geolocator = (function() {
	var INSTANCE;

	/**
	 * Constructor
	 */
	function geolocator() {
		if (!INSTANCE) INSTANCE = this;
	}

	function locate(locationSuccess, locationError, locationNotSupported) {
		var self = this;

		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(
			locationSuccess([position.coords.longitude, position.coords.latitude]), 
			emitLocationError(error)
		);
		else locationNotSupported();
	}

	geolocator.prototype.locate = locate;

	return new geolocator();
})();
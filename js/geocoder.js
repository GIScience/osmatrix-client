var Geocoder = (function() {
	var INSTANCE;

	var NOMINATIM_URL = 'http://nominatim.openstreetmap.org/search?format=json&polygon=0&addressdetails=1&viewbox=5.52,55.26,15.18,47.27&bounded=1';

	/**
	 * Constructor
	 */
	function geocoder() {
		if (!INSTANCE) INSTANCE = this;
	}

	/**
	 * [find description]
	 * @param  {[type]}   address  [description]
	 * @param  {Function} callback [description]
	 */
	function find(address, callback) {
		jQuery.getJSON(
			'/cgi-bin/proxy.cgi?url=' + encodeURIComponent(NOMINATIM_URL + '&q=' + address.replace(/\s+/g,'+')),
			null,
			callback
		);
	}

	geocoder.prototype.find = find;

	return new geocoder();
})();
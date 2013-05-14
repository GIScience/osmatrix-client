var Geocoder = (function (window) {
    "use strict";
    
	var $ = window.jQuery,
        NOMINATIM_URL = 'http://nominatim.openstreetmap.org/search?format=json&polygon=0&addressdetails=1&viewbox=5.52,55.26,15.18,47.27&bounded=1';

	/**
	 * Constructor
	 */
	function Geocoder() {
	}

	/**
	 * Sends the request to Nominatim and calls the callback function.
	 * @param  {String}   address  Address to be geocoded
	 * @param  {Function} callback Callback which is called after the results are returned from Nominatim
	 */
	function find(address, callback) {
		$.getJSON(
			'/cgi-bin/proxy.cgi?url=' + encodeURIComponent(NOMINATIM_URL + '&q=' + address.replace(/\s+/g, '+')),
			null,
			callback
		);
	}

	Geocoder.prototype.find = find;

	return new Geocoder();
}(window));
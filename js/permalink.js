var Permalink = (function () {
    'use strict';

	var state;

	/**
	 * Constructor
	 */
	function Permalink() {

	}

	/**
	 * [update description]
	 * @param  {[type]} zoom [description]
	 * @param  {[type]} lon  [description]
	 * @param  {[type]} lat  [description]
	 */
	function update(mode, layer, times, zoom, lon, lat) {
		if (!state) {state = {}; }
		if (mode) {state.mode = mode; }
		if (layer) {state.layer = layer; }
		if (times) {state.times = times; }
		if (zoom) {state.zoom = zoom; }
		if (lon) {state.lon = lon; }
		if (lat) {state.lat = lat; }
        
		var url = "#" + state.mode + "/" + state.layer + "/" + ((state.times.length === 1) ? state.times[0] + "/" : "") + state.zoom + "/" + state.lon + "/" + state.lat + ((state.times.length === 2) ? "?start=" + state.times[0] + "&end=" + state.times[1] : "");
		history.pushState(null, null, url);
	}

	/**
	 * [parse description]
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	function parse(url) {
		if (url.indexOf('#') !== -1) {
			state = {};
            
			var urlState = url.split('#')[1].split('/');
			state.mode = urlState[0];
			state.layer = urlState[1];
			state.times = [];
			if (urlState[0] === 'timestamp') {
				state.times.push(urlState[2]);
				state.zoom = urlState[3];
				state.lng = urlState[4];
				state.lat = urlState[5];
			} else {
				state.zoom = urlState[2];
				state.lng = urlState[3];
				state.lat = urlState[4].split('?')[0];

				var times = urlState[4].split('?')[1].split('&');
				for (var i = 0, len = times.length; i < len; i++) {
					state.times.push(times[i].split('=')[1]);
				}
			}
		}
		return state;
	}

	Permalink.prototype.update = update;
	Permalink.prototype.parse = parse;

	return new Permalink();
})();
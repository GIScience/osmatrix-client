var Permalink = (function(){

	var INSTANCE;

	/**
	 * Constructor
	 */
	function permalink() {
		if (!INSTANCE) INSTANCE = this;
	}

	/**
	 * [update description]
	 * @param  {[type]} zoom [description]
	 * @param  {[type]} lon  [description]
	 * @param  {[type]} lat  [description]
	 */
	function update(zoom, lon, lat) {
		history.pushState(null, null, "#" + zoom + "/" + lon + "/" + lat);
	}

	/**
	 * [parse description]
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	function parse(url) {
		var mapState;
		if (url.indexOf('#') != -1) {
			var urlState = url.split('#')[1].split('/');
			if (urlState.length === 3) {
				mapState = {
					lonlat: [urlState[2], urlState[1]],
					zoom: urlState[0]
				};
			}
		}
		return mapState;
	}

	permalink.prototype.update = update;
	permalink.prototype.parse = parse;

	return new permalink();
})();
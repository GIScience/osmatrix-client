var Map = (function(){
	var theMap;
	var tiledLayer, matrixLayer;

	/**
	 * Constructor
	 * @param  {[type]} container [description]
	 */
	function map(container) {
		theMap = L.map(container).setView([51.505, -0.09], 13);
		tiledLayer = new L.StamenTileLayer("toner-lite");
		theMap.addLayer(tiledLayer);

		matrixLayer = L.tileLayer('http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/map/totalNumbOfPOIs/diff/{z}/{x}/{y}?start=2&end=4', {
    		maxZoom: 18
		});
		theMap.addLayer(matrixLayer);
	}

	return map;
})();
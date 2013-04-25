var OSMatrix = (function (w) {
    "use strict";
    
    var $ = w.jQuery,
        PROXY_URL = "/cgi-bin/proxy.cgi?url=",
        API_URL = "http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/",
        MODE = {
            timestamp: 1,
            diff: 2
        };
    
    function Osmatrix() {
        
    }
    
    function get(url, callback) {
        $.getJSON(
			PROXY_URL + encodeURIComponent(url),
			null,
			callback
		);
    }
    
    function getCapabilities(callback) {
        get(API_URL + 'api', callback);
    }
    
    function getLegend(mode, layer, callback) {
        get(API_URL + 'map/' + layer + '/' + mode + '/legend', callback);
    }
    
    function getLayerUrl(mode, layer, times) {
		if (MODE[mode] === MODE.timestamp) {
			return API_URL + 'map/' + layer + '/timestamp/' + times[0] + '/{z}/{x}/{y}';
		} else {
			return API_URL + 'map/' + layer + '/diff/{z}/{x}/{y}?start=' + times[0] + '&end=' + times[1];
		}
    }
    
    function getFeatureInfoFromPoint(attribute, latlng, callback) {
        get(API_URL + 'api/attributes/' + attribute + '?proj=4326&lat=' + latlng.lat + '&lon=' + latlng.lng, callback);
    }
    
    Osmatrix.prototype.getCapabilities = getCapabilities;
    Osmatrix.prototype.getLegend = getLegend;
    Osmatrix.prototype.getLayerUrl = getLayerUrl;
    Osmatrix.prototype.getFeatureInfoFromPoint = getFeatureInfoFromPoint;
    
    return new Osmatrix();
}(window));
var OSMatrix = (function ($) {
    "use strict";
    
    var PROXY_URL = "/cgi-bin/proxy.cgi?url=",
        API_URL = "http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/";
    
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
    
    Osmatrix.prototype.getCapabilities = getCapabilities;
    
    return new Osmatrix();
}(jQuery));
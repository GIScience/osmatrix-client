var OSMatrix = (function ($) {
    "use strict";
    
    var INSTANCE,
        PROXY_URL = "/cgi-bin/proxy.cgi?url=",
        API_URL = "http://lemberg.geog.uni-heidelberg.de:50684/osmatrix/";
    
    function OSMATRIX() {
        if (!INSTANCE) {INSTANCE = this; }
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
    
    OSMATRIX.prototype.getCapabilities = getCapabilities;
    
    return new OSMATRIX();
}(jQuery));
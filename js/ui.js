var Ui = (function ($) {
    'use strict';
    
    var TOOLS = {geolocate: 'geolocate', layer: 'layer', geocode: 'searchPlace' },
        theInterface;
    
    
    
    
    /* *********************************************************************
	 * GENERAL
	 * *********************************************************************/
    
    /**
	 * [setLoadingState description]
	 * @param {[type]} state [description]
	 * @param {[type]} tool  [description]
	 */
	function setLoadingState(state, tool) {
		if (state) {
			$('#' + tool + ' button').addClass('loading');
			$('#' + tool + ' .spinner').addClass('loading');
		} else {
			$('#' + tool + ' button').removeClass('loading');
			$('#' + tool + ' .spinner').removeClass('loading');
		}
	}
    
    /**
	 * [toggleActiveState description]
	 * @param  {[type]} tool [description]
	 */
	function toggleActiveState(tool) {
        $('#toolbox button').not('#' + tool + ' > button').removeClass('active');
		$('#toolbox .content').not('#' + tool + ' > .content').removeClass('active');
        
		$('#' + tool + ' > button').toggleClass('active');
		$('#' + tool + ' > .content').toggleClass('active');
	}
    
    /**
	 * [handleButtonClick description]
	 * @return {[type]} [description]
	 */
	function handleButtonClick(e) {
		var toolId = $(e.currentTarget).parent().attr('id');
		if (toolId === TOOLS.geolocate) {
			setLoadingState(true, TOOLS.geolocate);
			theInterface.emit('ui:geolocationRequest');
		} else {
			toggleActiveState(toolId);
		}
	}
    
    
    
    
    /* *********************************************************************
	 * GEOLOCATION
	 * *********************************************************************/
    
    function stopGeolocation(text) {
        setLoadingState(false, TOOLS.geolocate);
        if (text) {displayMessage('error', text); }
    }
    
    function deactivateGeolocation(text) {
        stopGeolocation();
        $(TOOLS.geolocate).hide();
        if (text) {displayMessage('error', text); }
    }
    
    
    
    /* *********************************************************************
	 * GEOCODER
	 * *********************************************************************/
    
    /**
	 * [handleFormType description]
	 */
	function handleFormType(e) {
		if (e.keyCode === 13) {
			setLoadingState(true, TOOLS.geocode);
            theInterface.emit('ui:geocodeRequest', $(e.currentTarget).val());
		}
	}
    
    /**
	 * [handleGeocodeLinkClick description]
	 */
	function handleGeocodeLinkClick(e) {
        theInterface.emit('ui:geocodeLinkClick', $(e.currentTarget).attr('href'));
		return false;
	}
    
    /**
	 * [handleGeocodeResults description]
	 * @param  {[type]} results [description]
	 */
	function updateGeocodeResultList(permaLink, results) {
        var queryParams = '?' + permaLink.split('?')[1] || '',
            linkBase = ((permaLink.indexOf('?') !== -1) ? permaLink.substring(0, permaLink.indexOf('?')) : permaLink.substring(0)).split('#')[0],
            mapState = ((permaLink.indexOf('?') !== -1) ? permaLink.substring(0, permaLink.indexOf('?')) : permaLink.substring(0)).split('#')[1].split('/');
        
        if (results) {
            $('#' + TOOLS.geocode + ' ul.resultList').children().remove();
		
            if (results.length > 0) {
                for (var i = 0, len = results.length; i < len; i++) {
                    var address = results[i];
                    mapState[mapState.length - 1] = parseFloat(address.lat);
                    mapState[mapState.length - 2] = parseFloat(address.lon);
                    
                    var address = results[i];
                    var link = linkBase + "#" + mapState.join("/") + queryParams;
                    
                    $('#' + TOOLS.geocode + ' ul.resultList').append('<li><a href="' + link + '">' + address.display_name + '</a></li>');
                }
            } else {
                $('#' + TOOLS.geocode + ' ul.resultList').append('<li class="noResult">No results matching your query have been found.</li>');
            }
            
            $('#' + TOOLS.geocode + ' ul.resultList li a').click(handleGeocodeLinkClick);
        } else {
            
        }
        
        setLoadingState(false, TOOLS.geocode);
	}
    
    
    
    
    /* *********************************************************************
	 * LAYER
	 * *********************************************************************
    
    /**
     * [handleLayerModeToogle description]
     * @return {[type]} [description]
     */
    function handleLayerModeToogle(e) {
        $(e.currentTarget).siblings().removeClass('btn-success active');
        $(e.currentTarget).addClass('btn-success active');

        var timeElements = $('#' + TOOLS.layer + ' input[name="timestamp"]');
        for (var i = 0, len = timeElements.length; i < len; i++) {
        	if ((i === 0 && this.value === 'diff') || i === len - 1) {
        		timeElements[i].checked = true; 
        	} else {
        		timeElements[i].checked = false;
        	}
	    }
    }
    
    /**
     * [handleTimeStampChange description]
     * @return {[type]} [description]
     */
    function handleTimeStampChange() {
   		var mode = $('#' + TOOLS.layer + ' #layerMode button.active').val();
    	var timeElements = $('#' + TOOLS.layer + ' input[name="timestamp"]:checked');
    	
	    if ((mode === 'diff' && timeElements.length > 2) || mode === 'timestamp') {
	    	for (var i = 0, len = timeElements.length; i < len; i++) {
		   		if (timeElements[i].value != this.value) {timeElements[i].checked = false; }
		   	}
	    }
    }
    
    function initializeLayerSwitcher(c) {
        for (var i = 0, len = c.attributes.length; i < len; i++) {
            $('#' + TOOLS.layer + ' select#characteristics').append('<option value="' + c.attributes[i].name + '">' + c.attributes[i].title + '</option>');
        }

        for (var i = 0, len = c.timestamps.length; i < len; i++) {
            $('#' + TOOLS.layer + ' fieldset#timestamps').append('<label class="checkbox"><input ' + ((i === len - 1) ? 'checked="checked"' : '') + ' type="checkbox" name="timestamp" value="' + c.timestamps[i].id + '">' + c.timestamps[i].timestamp + '</label>');
        }

        $('#' + TOOLS.layer + ' input[name="timestamp"]').change(handleTimeStampChange);
    }
    
    function setLayerSwitcherToMode(state) {
        if (state) {
            $('#' + TOOLS.layer + ' .btn-group button[value="' + state.mode + '"]').click();
            $('#' + TOOLS.layer + ' #characteristics').val(state.layer);
    
            var times = $('#' + TOOLS.layer + ' input[name="timestamp"]');
            for (var i = 0, len = times.length; i < len; i++) {
              times[i].checked = (state.times.indexOf(times[i].value) != -1);
            }
        }
        
        $('#' + TOOLS.layer + ' form').submit();
    }
    
    /**
     * [handleLayerChange description]
     */
    function handleLayerSubmit() {
    	var layer = $('#' + TOOLS.layer + ' select#characteristics').val();
    	var mode = $('#' + TOOLS.layer + ' #layerMode button.active').val();
    	
    	var times = [];
    	var timeElements = $('#' + TOOLS.layer + ' input[name="timestamp"]');
    	for (var i = 0, len = timeElements.length; i < len; i++) {
    		if (timeElements[i].checked) {times.push(timeElements[i].value)}
    	}

    	if ((mode === 'diff' && times.length === 2) || mode === 'timestamp') {
            theInterface.emit('ui:layerUpdate', {
                mode: mode,
                layer: layer,
                times: times
            });
    	} else {
    		displayMessage("warning", "Please select two timestamps for comparison.")
    	}
        
    	return false;
    }
    
    
    
    
    /* *********************************************************************
	 * Message
	 * *********************************************************************/
    
    function displayMessage(type, text) {
        alert(text);
    }
    
    /* *********************************************************************
	 * CONSTRUCTOR
	 * *********************************************************************/
    
    function Ui() {
        $('.tool > button').click(handleButtonClick);
        $('#' + TOOLS.layer + ' .btn-group button').click(handleLayerModeToogle);
        $('#' + TOOLS.geocode + ' input[type="text"]').keyup(handleFormType);
        $('#' + TOOLS.layer + ' form').submit(handleLayerSubmit);
    }
    
    
    
    Ui.prototype = new EventEmitter();
	Ui.prototype.constructor = Ui;
    
    Ui.prototype.setLoadingState = setLoadingState;
    Ui.prototype.toggleActiveState = toggleActiveState;
    Ui.prototype.updateGeocodeResultList = updateGeocodeResultList;
    Ui.prototype.initializeLayerSwitcher = initializeLayerSwitcher;
    Ui.prototype.setLayerSwitcherToMode = setLayerSwitcherToMode;
    Ui.prototype.stopGeolocation = stopGeolocation;
    Ui.prototype.deactivateGeolocation = deactivateGeolocation;
    
    theInterface = new Ui();
    
    return theInterface;
}(jQuery));
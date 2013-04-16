var Controller = (function ($) {
    'use strict';
    
	var TOOLS = {
		geolocate: 'geolocate',
		layer: 'layer',
		geocode: 'searchPlace'
	}, map;

	/**
	 * [initialize description]
	 */
	function initialize() {
		map = new Map('map');

		map.register('layer:loadStart', handleMapLoadStart);
		map.register('layer:loadEnd', handleMapLoadEnd);
		map.register('map:changed', handleMapChanged);

		$('.tool > button').click(handleButtonClick);
        $('#' + TOOLS.layer + ' .btn-group button').click(handleLayerModeToogle);
        $('#' + TOOLS.layer + ' form').submit(handleLayerSubmit);
		$('#' + TOOLS.geocode + ' input[type="text"]').keyup(handleFormType);

		initializeTheMatrix();
	}

    function initializeTheMatrix() {
        OSMatrix.getCapabilities(handleMatrixCapabilities);
    }
    
	/**
	 * [setInitialMapLocation description]
	 */
	function initializeTheMap() {
		var permaLink = Permalink.parse(document.URL);
		if (permaLink) {
			map.moveTo([permaLink.lat, permaLink.lng], permaLink.zoom);
			$('#' + TOOLS.layer + ' .btn-group button[value="' + permaLink.mode + '"]').click();
			$('#' + TOOLS.layer + ' #characteristics').val(permaLink.layer);

			var times = $('#' + TOOLS.layer + ' input[name="timestamp"]');
			for (var i = 0, len = times.length; i < len; i++) {
				times[i].checked = (permaLink.times.indexOf(times[i].value) != -1);
			}

        } else {
            getCurrentPosition();
        }

        $('#' + TOOLS.layer + ' form').submit();
	}

	/**
	 * [getCurrentPosition description]
	 */
	function getCurrentPosition() {
		Geolocator.locate(handleGeolocateSuccess, handleGeolocateError, handleGeolocateNoSupport);
	}

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
		$('#' + tool + ' > button').toggleClass('active');
		$('#' + tool + ' > .content').toggleClass('active');
	}

	/* *********************************************************************
	 * EVENT HANDLERS
	 * *********************************************************************/

	 /**
	 * [handleButtonClick description]
	 * @return {[type]} [description]
	 */
	function handleButtonClick() {
		var toolId = $(this).parent().attr('id');
		if (toolId === TOOLS.geolocate) {
			setLoadingState(true, TOOLS.geolocate);
			getCurrentPosition();
		} else {
			toggleActiveState(toolId);
		}
	}
    
    /**
     * [handleLayerModeToogle description]
     * @return {[type]} [description]
     */
    function handleLayerModeToogle() {
        $(this).siblings().removeClass('btn-success active');
        $(this).addClass('btn-success active');

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
   		var mode = map.MODE[$('#' + TOOLS.layer + ' #layerMode button.active').val()];
    	var timeElements = $('#' + TOOLS.layer + ' input[name="timestamp"]:checked');
    	
	    if ((mode === map.MODE.diff && timeElements.length > 2) || mode === map.MODE.timestamp) {
	    	for (var i = 0, len = timeElements.length; i < len; i++) {
		   		if (timeElements[i].value != this.value) {timeElements[i].checked = false; }
		   	}
	    }
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

    	if ((map.MODE[mode] === map.MODE.diff && times.length === 2) || map.MODE[mode] === map.MODE.timestamp) {
    		map.updateMatrixLayer(mode, layer, times);	
    	} else {
    		alert("Please select two timestamps for comparison.")
    	}
    	

    	return false;
    }

	/**
	 * [handleFormType description]
	 */
	function handleFormType(event) {
		if (event.keyCode === 13) {
			setLoadingState(true, TOOLS.geocode);
			Geocoder.find($(this).val(), handleGeocodeResults);
		}
	}

	/**
	 * [handleMapLoadStart description]
	 * @return {[type]} [description]
	 */
	function handleMapLoadStart() {
		setLoadingState(true, TOOLS.layer);
	}

	/**
	 * [handleMapLoadEnd description]
	 * @return {[type]} [description]
	 */
	function handleMapLoadEnd() {
		setLoadingState(false, TOOLS.layer);
	}

	/**
	 * [handleMapMove description]
	 * @param  {[type]} mapState [description]
	 * @return {[type]}          [description]
	 */
	function handleMapChanged(mapState) {
		Permalink.update(mapState.mode, mapState.layer, mapState.times, mapState.zoom, mapState.lon, mapState.lat);
	}

	/**
	 * [handleGeolocateSuccess description]
	 * @param  {[type]} position [description]
	 * @return {[type]}          [description]
	 */
	function handleGeolocateSuccess(position) {
		map.moveTo([position.coords.latitude, position.coords.longitude]);
		setLoadingState(false, TOOLS.geolocate);
	}

	/**
	 * [handleGeolocateError description]
	 * @param  {[type]} error [description]
	 * @return {[type]}       [description]
	 */
	function handleGeolocateError(error) {
		setLoadingState(false, TOOLS.geolocate);
		switch (error.code) {
            case error.UNKNOWN_ERROR:
                alert('The location acquisition process failed');
                break;
            case error.PERMISSION_DENIED:
                $(TOOLS.geolocate).hide();
                break;
            case error.POSITION_UNAVAILABLE:
                alert('The position of the device could not be determined. One or more of the location providers used in the location acquisition process reported an internal error that caused the process to fail entirely.');
                break;
            case error.TIMEOUT:
                alert('The location acquisition timed out');
                break;
        }
	}

	/**
	 * [handleGeolocateNoSupport description]
	 */
	function handleGeolocateNoSupport() {
		setLoadingState(false, TOOLS.geolocate);
		$(TOOLS.geolocate).hide();
		alert('Geolocation API is not supported by your browser.');
	}

	/**
	 * [handleGeocodeResults description]
	 * @param  {[type]} results [description]
	 */
	function handleGeocodeResults(results) {
		var linkBase = document.URL.split('#')[0];
		$('#' + TOOLS.geocode + ' ul.resultList').children().remove();
		
		if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var address = results[i];
                var link = linkBase + "#10/" + parseFloat(address.lon) + "/" + parseFloat(address.lat);
                $('#' + TOOLS.geocode + ' ul.resultList').append('<li><a href="' + link + '">' + address.display_name + '</a></li>');
            }
        } else {
            $('#' + TOOLS.geocode + ' ul.resultList').append('<li class="noResult">No results matching your query have been found.</li>');
        }
        

		$('#' + TOOLS.geocode + ' ul.resultList li a').click(handleGeocodeLinkClick);

		setLoadingState(false, TOOLS.geocode);
	}

	/**
	 * [handleGeocodeLinkClick description]
	 */
	function handleGeocodeLinkClick() {
		map.moveTo(Permalink.parse($(this).attr('href')).lonlat);
		return false;
	}
    
    /**
     * [handleMatrixCapabilities description]
     * @param  {[type]} capabilities [description]
     */
    function handleMatrixCapabilities(capabilities) {
    	for (var i = 0, len = capabilities.attributes.length; i < len; i++) {
            $('#' + TOOLS.layer + ' select#characteristics').append('<option value="' + capabilities.attributes[i].name + '">' + capabilities.attributes[i].title + '</option>');
        }

        for (var i = 0, len = capabilities.timestamps.length; i < len; i++) {
            $('#' + TOOLS.layer + ' fieldset#timestamps').append('<label class="checkbox"><input ' + ((i === len - 1) ? 'checked="checked"' : '') + ' type="checkbox" name="timestamp" value="' + capabilities.timestamps[i].id + '">' + capabilities.timestamps[i].timestamp + '</label>');
        }

        $('#' + TOOLS.layer + ' input[name="timestamp"]').change(handleTimeStampChange);
        initializeTheMap();
    }

	var controller = function() {};
	controller.prototype.initialize = initialize;
	return new controller();
}(jQuery));

window.onload = Controller.initialize;
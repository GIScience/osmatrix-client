var Ui = (function (w) {
    'use strict';
    
    var $ = w.jQuery,
        d3 = w.d3,
        TOOLS = {geolocate: 'geolocate', layer: 'layer', geocode: 'searchPlace', legend: 'legend', featureInfo: 'featureInfo', message: 'message' },
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
            $('#' + tool).addClass('loading');
			$('#' + tool + ' button').addClass('loading');
			$('#' + tool + ' .spinner').addClass('loading');
		} else {
            $('#' + tool).removeClass('loading');
			$('#' + tool + ' button').removeClass('loading');
			$('#' + tool + ' .spinner').removeClass('loading');
		}
	}
    
    /**
	 * [toggleActiveState description]
	 * @param  {[type]} tool [description]
	 */
	function toggleActiveState(tool) {
        $('.tool').not('#' + tool).removeClass('active');
        $('.tool > button').not('#' + tool + ' > button').removeClass('active');
		$('.tool > .content').not('#' + tool + ' > .content').removeClass('active');
        $('#sidebar').removeClass('active');
        
        
        console.log($('#' + tool));
        $('#' + tool).toggleClass('active');
		$('#' + tool + ' > button').toggleClass('active');
		$('#' + tool + ' > .content').toggleClass('active');
        
        if ($('#' + tool).parent().attr('id') === 'sidebar' && $('#' + tool + ' > button').hasClass('active')) {
            $('#sidebar').addClass('active');
        }
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
	 * MESSAGE
	 * *********************************************************************/
    
    function hideMessage() {
        $('#' + TOOLS.message).hide();
    }
    
    function displayMessage(type, text) {
        $('#' + TOOLS.message).removeClass().addClass(type);
        $('#' + TOOLS.message + ' h3').text(type.charAt(0).toUpperCase() + type.slice(1));
        $('#' + TOOLS.message + ' p').text(text);
        $('#' + TOOLS.message + ' > #actions > button').click(hideMessage);
        $('#' + TOOLS.message).show();
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
        $('#' + TOOLS.geolocate).hide();
        if (text) {displayMessage('error', text); }
    }
    
    
    
    /* *********************************************************************
	 * GEOCODER
	 * *********************************************************************/
    
    /**
	 * [handleFormType description]
	 */
	function handleFormType(e) {
        var key = e.which || e.keyCode;
        
		if (key === 13) {
			setLoadingState(true, TOOLS.geocode);
            theInterface.emit('ui:geocodeRequest', $(e.currentTarget).val());
            return false;
		}
	}
    
    /**
	 * [handleGeocodeLinkClick description]
	 */
	function handleGeocodeLinkClick(e) {
        theInterface.emit('ui:geocodeLinkClick', $(e.currentTarget).attr('href'));
        if ($('#' + TOOLS.geocode + ' > button').hasClass('active')) {$('#' + TOOLS.geocode + ' > button').click(); }
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
        $('header').addClass('hide');
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
    		displayMessage("warning", "Please select two timestamps for comparison.");
    	}
        
        if ($('#' + TOOLS.layer + ' > button').hasClass('active')) {$('#' + TOOLS.layer + ' > button').click(); }
        
    	return false;
    }
    
	
    
    function setLayerLoadingState (state) {
        setLoadingState(state, TOOLS.layer);
    }
    
    
    
    
    /* *********************************************************************
	 * LEGEND
	 * *********************************************************************/
    
    function updateLegend(l) {
        $('#toolbox > h2').text(l.attribute.title);
        $('#' + TOOLS.legend + ' .content #labels').children().remove();
        $('#' + TOOLS.legend + ' .content h3').text(l.attribute.title);
        $('#' + TOOLS.legend + ' .content p.desc').text(l.attribute.description);
        
        for (var i = 0, len = l.labels.length; i < len; i++) {
            $('#' + TOOLS.legend + ' .content #labels').append('<div class="legendItem"><span class="graphic" style="background-color: ' + l.labels[i].color + ';"></span>' + l.labels[i].label + '</div>');
        }
    }
    
    
    
    /* *********************************************************************
	 * FEATURE INFO
	 * *********************************************************************/
    
    function updateFeatureInfo(info, colors) {
        $('#' + TOOLS.featureInfo + ' #chart').empty();
        
        if (info && colors) {
            $('#' + TOOLS.featureInfo + ' h3').text(info.attribute.title);
            $('#' + TOOLS.featureInfo + ' p').text(info.attribute.description);
            
            var chartArea,
                WIDTH = $('#' + TOOLS.featureInfo + ' #chart').width(),
                HEIGHT = $('#' + TOOLS.featureInfo + ' #chart').height(),
                MARGIN_TOP = 10,
                MARGIN_LEFT = 60,
                MARGIN_BOTTOM = 60,
                min, max, xScale, yScale, xDomain = [],
                line = d3.svg.line()
                        .x(function(d) {return xScale(d.timestamp); })
                        .y(function(d) {return yScale(d.value); })
                        .interpolate("linear"),
                stddevArea = d3.svg.area()
                        .x(function(d) {return xScale(d.timestamp); })
                        .y0(function(d) {return yScale(d.lower); })
                        .y1(function(d) {return yScale(d.upper); }),
                averages = [],
                stddev = [];
            
            for (var key in info.stats) {
                min = d3.min([info.stats[key].min, min]);
                max = d3.max([info.stats[key].max, max]);
            }
            
            if (info.attribute === 'DateOfLatestEdit' || info.attribute === 'dateOfEldestEdit') {MARGIN_LEFT += 20; }
                else {min = 0; }
            
            for (var i = 0, len = info.timestamps.length; i < len; i++) {
                xDomain.push(info.timestamps[i].timestamp.substring(0, info.timestamps[i].timestamp.lastIndexOf('-')));
            }
            
            xScale = d3.scale.ordinal().domain(xDomain).rangePoints([MARGIN_LEFT + 10, WIDTH - 20]);
            yScale = d3.scale.linear().domain([max,	min]).range([MARGIN_TOP + 10, (HEIGHT - MARGIN_BOTTOM)]);
            
            chartArea = d3.select("div#chart").append("svg")
                .attr("width", WIDTH)
                .attr("height", HEIGHT);
            
            // **********************
            // PLOT STATISTICAL MEASURES
            
            for (var key in info.stats) {
                averages.push({"timestamp": key, "value": info.stats[key].avg});
                stddev.push({"timestamp": key, "upper": info.stats[key].avg + info.stats[key].std, "lower": info.stats[key].avg - info.stats[key].std});
            }
            
            chartArea.append("svg:path")
                  .datum(stddev)
                  .attr("fill", '#f0f0f0')   
                  .attr("d", stddevArea);
            
            chartArea.append("svg:path")
                    .attr("d", line(averages))
                    .attr("stroke", '#bbb')
                    .attr("stroke-width", 2)
                    .attr("fill", "transparent");
            
            
            // **********************
            // PREPARE THE CHART AREA
            
            
            chartArea.selectAll(".yRule")
                    .data(yScale.ticks(5))
                .enter().append("line")
                    .attr("class", "yRule")
                    .attr("x1", MARGIN_LEFT)
                    .attr("x2", WIDTH)
                    .attr("y1", yScale)
                    .attr("y2", yScale)
                    .style("stroke", "#ccc");
                    
            chartArea.append("svg:line")
                    .attr("class", "yBase")
                    .attr("x1", MARGIN_LEFT)
                    .attr("x2", WIDTH)
                    .attr("y1", (HEIGHT - MARGIN_BOTTOM))
                    .attr("y2", (HEIGHT - MARGIN_BOTTOM))
                    .style("stroke", "#000")
                    .style("stroke-width", "1");
            
            chartArea.selectAll(".yLabel")
                    .data(yScale.ticks(5))
                .enter().append("svg:text")
                    .attr("class", "yLabel")
                    .text(function (d) {
                        if (info.attribute == 'DateOfLatestEdit' || info.attribute == 'dateOfEldestEdit') {
                            var date = new Date(d);
                            var m = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
                            return date.getFullYear() + "-" + m;
                        } else {
                            return d;
                        }
                    })
                    .attr("x", MARGIN_LEFT - 10)
                    .attr("y", yScale)
                    .attr("text-anchor", "end");
            
            
            chartArea.selectAll(".xTicks")
                    .data(xDomain)
                .enter().append("svg:line")
                    .attr("class", "xTicks")
                    .attr("x1", function(d) {return xScale(d);})
                    .attr("x2", function(d) {return xScale(d);})
                    .attr("y1", HEIGHT - MARGIN_BOTTOM)
                    .attr("y2", HEIGHT - MARGIN_BOTTOM + 5)
                    .style("stroke", "#000");
    
            chartArea.selectAll(".xLabel")
                    .data(xDomain)
                .enter().append("svg:text")
                    .attr("class", "xLabel")
                    .text(function(d) {return d;})
                    .attr("x", function(d) {return xScale(d);})
                    .attr("y", HEIGHT - MARGIN_BOTTOM + 10)
                    .attr("text-anchor", "top")
                    .attr("style", "writing-mode: tb;");
            
            
            
            // **********************
            // PLOT THE GRAPH
            
            for (var i = 0, len = info.result.length; i < len; i++) {
                var item = info.result[i],
                    value = [];
                
                for (var key in item.values) {
                    value.push({"timestamp": key, "value": item.values[key]});
                }
                
                chartArea.append("svg:path")
                    .attr("d", line(value))
                    .attr("stroke", colors[i])
                    .attr("fill", "transparent");
                
                chartArea.selectAll("path" + item.cell_id).data(value)
                    .enter().append("svg:circle")
                    .attr("class", "path" + item.cell_id)
                    .attr("cx", function(d) {return xScale(d.timestamp.substring(0, d.timestamp.lastIndexOf('-'))); })
                    .attr("cy", function(d) {return yScale(d.value); })			
                    .attr("r", 3)		
                    .attr("fill", "#ffffff")
                    .attr("stroke", colors[i])
                    .attr("stroke-width", 2);
            }
            
            // **********************
            // OPEN THE THING, YO!
            
            if (!$('#' + TOOLS.featureInfo + '> .content').hasClass('active')) {$('#' + TOOLS.featureInfo + ' button').click(); }
        } else {
            $('#' + TOOLS.featureInfo + ' h3').text('');
            $('#' + TOOLS.featureInfo + ' p').text('Click on the map to get information on the temporal evolution of the selected characteristic in the area of interest.');
        }
        setLoadingState(false, TOOLS.featureInfo);
    }
    
    function setFeatureInfoLoadingState(state) {
        setLoadingState(state, TOOLS.featureInfo);
    }
    
    /* *********************************************************************
	 * CONSTRUCTOR
	 * *********************************************************************/
    
    function Ui() {
        $('.tool > button').click(handleButtonClick);
        $('#' + TOOLS.layer + ' .btn-group button').click(handleLayerModeToogle);
        $('#' + TOOLS.geocode + ' input[type="text"]').keypress(handleFormType);
        $('#' + TOOLS.layer + ' form').submit(handleLayerSubmit);
        hideMessage();
    }
    
    
    
    Ui.prototype = new EventEmitter();
	Ui.prototype.constructor = Ui;
    
    Ui.prototype.updateGeocodeResultList = updateGeocodeResultList;
    Ui.prototype.initializeLayerSwitcher = initializeLayerSwitcher;
    Ui.prototype.setLayerSwitcherToMode = setLayerSwitcherToMode;
    Ui.prototype.stopGeolocation = stopGeolocation;
    Ui.prototype.deactivateGeolocation = deactivateGeolocation;
    Ui.prototype.updateLegend = updateLegend;
    Ui.prototype.updateFeatureInfo = updateFeatureInfo;
    Ui.prototype.setLayerLoadingState = setLayerLoadingState;
    Ui.prototype.setFeatureInfoLoadingState = setFeatureInfoLoadingState;
    
    
    theInterface = new Ui();
    
    return theInterface;
}(window));
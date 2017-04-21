/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var my_map = L.map('mapid', {
        center: [38, -90],
        zoom: 5
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(my_map);

    //call getData function
    getData(my_map);
};

// function to add an easyButton beneath the zoom
function toggleJSON(my_map) {
    L.easyButton('fa-eye', function() {
        // pass in identifier to toggle
        toggleItem('g');
    }).addTo(my_map);
};

// function to toggle an html element passed to it
function toggleItem(class_string) {
    $(class_string).toggle();
};

function createPropSymbols(data, my_map, attributes) {
    L.geoJson(data, {
        // call pointToLayer function instead of using anonymous function
        pointToLayer: function(feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(my_map);
};

function createPopup(feature, layer, radius) {
    var popupContent = feature.properties.gage;
    
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -radius),
        closeButton: false
    });
};

function pointToLayer(feature, latlng, attributes) {
    //attribute to apply to
    var attribute = attributes[0];

    var options = {
        "name": "geojson",
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    // get attribute value
    var attValue = Number(feature.properties[attribute]);
    if (attValue == 0) {
        attValue = 1;
    }

    // set circle marker radius
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    var panelContent = "<p><b>MS River Gage:</b> " + 
                        feature.properties.gage + 
                        "</p><p><b><u>Height</u></br>" + attribute + ":  </b>" + 
                        feature.properties[attribute] + " feet</p>";
    // $("#panel").html(panelContent);

    createPopup(feature, layer, options.radius);

    layer.on({
        mouseover: function() {
            this.openPopup();
        },
        mouseout: function() {
            this.closePopup();
        },
        click: function() {
            $("#panel").html(panelContent);
        }
    });

    return layer;
};

// calcluate radius of each symbol
function calcPropRadius(attValue) {
    var scaleFactor = 50;
    var area = attValue * scaleFactor;
    var radius = Math.sqrt(area/Math.PI);

    return Math.sqrt(area/Math.PI);
}

function createSequenceControls(my_map, attributes) {
    //prototypal inheritence
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (my_map) {
            var container =  L.DomUtil.create('div', 'sequence-control-container');

            // create the range input element
            $(container).append('<input class="range-slider" type="range">');
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Forward</button>');

            $(container).on('mousedown dblclick', function(e) {
                L.DomEvent.stopPropagation(e);
            });

            return container;
        }
    });

    my_map.addControl(new SequenceControl());

    $('#reverse').html('<img src="img/back.png"/>');
    $('#forward').html('<img src="img/forward.png"/>');

    // set attributes
    $('.range-slider').attr({
        max: 43,
        min: 1,
        value: 1,
        step: 1
    });

    $('.skip').click(function(){
        var index = $('.range-slider').val();
        var max_index = $('.range-slider').attr('max');

        // increment by 1 or -1
        if ($(this).attr('id') == 'reverse') {
            index--;
            index = index < 1 ? max_index : index;
        } else if ($(this).attr('id') == 'forward') {
            index++;
            index = index > max_index ? 1 : index;
        };
        // update slider with index
        $('.range-slider').val(index);

        updatePropSymbols(my_map, attributes[index]);
    });

    $('.range-slider').on('input', function(){
        var index = $(this).val();

        updatePropSymbols(my_map, attributes[index]);
    });

    // easy button to filter geojson
    L.easyButton({
        states: [{
                icon:      'fa-ge',
                title:     'Filter > 20 ft',
                onClick: function(btn, my_map) {
                    filterPropSymbols(my_map, attributes[$('.range-slider').val()])
                }
            }]
    }).addTo(my_map);
};

// create legend
function createLegend(my_map, attributes) {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function(my_map) {
            var container = L.DomUtil.create('div', 'legend-control-container');
            $(container).append('<div id="temporal-legend">')

            var svg = '<svg id="attribute-legend" width="190px" height="90px">';
            // var circles = ['max', 'mean', 'min'];
            var circles = {
                max: 20,
                mean: 40,
                min: 60
            };

            for (var circle in circles) {
                console.log(circle);
                svg += '<circle class="legend-circle" id="' + circle + 
                '" fill="#ff7800" fill-opacity="0.8" stroke="#000000" cx="32"/>';
                svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            };
            svg += "</svg>";

            $(container).append(svg);

            return container;
        }
    });

    my_map.addControl(new LegendControl());
    getLegendInput(my_map, attributes[0]);
};

function getCircleValues(my_map, attribute){
    var min = Infinity,
        max = -Infinity;

    my_map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

function getLegendInput(my_map, attribute) {
    // current_index = $('.range-slider').val();
    $('#temporal-legend').html(attribute);

    var circleValues = getCircleValues(my_map, attribute);

    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 63 - radius,
            r: radius
        });

        $('#'+ key + '-text').text(Math.round(circleValues[key]*100)/100 + " feet");
    };
};

function clearLayer(my_map) {
    my_map.eachLayer(function(layer) {
        if (layer.feature) { //&& layer.feature.properties[attribute])
            var json_layer = layer;
            my_map.removeLayer(json_layer);
        };
    });
};

function filterPropSymbols(my_map, attribute) {
    clearLayer(my_map);
    $.ajax("data/Mississippi_River_Stages.geojson", {
        dataType : "json",
        success : function(response) {
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                },
                filter : function(feature, layer) {
                    return feature.properties[attribute] > 20;
                }
            }).addTo(my_map);
            updatePropSymbols(my_map, attribute);
        }
    });
}

function updatePropSymbols(my_map, attribute) {
    my_map.eachLayer(function(layer) {
        if (layer.feature && layer.feature.properties[attribute]) {

            var props = layer.feature.properties;
            
            // Calculate radius of marker size by using attribute value
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            // HTML formatted message for the separate panel on click
            var panelContent = "<p><b>MS River Gage:</b> " + 
                                props.gage + 
                                "</p><p><b><u>Height</u></br>" + attribute + ":  </b>" + 
                                props[attribute] + " feet</p>";

            // use of jquery to overwrite the content of the panel automatically without click
            $("#panel").html(panelContent);
            
            feature = layer.feature;
            createPopup(feature, layer, radius);
            
            $('#temporal-legend').html(attribute);
            getLegendInput(my_map, attribute);
            
        };
    });
}

function processData(data) {
    var attributes = [];
    var properties = data.features[0].properties;

    for (var attribute in properties) {
        if (attribute.includes("/")) {
            attributes.push(attribute);
        };
    };

    // Use of swap to reverse order of arrays
    // due to backwards order in geojson
    var left = null;
    var right = null;
    var length = attributes.length;
    for (left = 0, right = length - 1; left < right; left += 1, right -= 1)
    {
        var temporary = attributes[left];
        attributes[left] = attributes[right];
        attributes[right] = temporary;
    }
    return attributes;
}

function getData(my_map) {
    L.easyButton('fa-home', function() {
        // pass in identifier to toggle
        create_map();
    }).addTo(my_map);    
    
    toggleJSON(my_map);
    
    // load the data
    $.ajax("data/Mississippi_River_Stages.geojson", {
        dataType: "json",
        success: function(response) {
            var attributes = processData(response);

            createPropSymbols(response, my_map, attributes);
            createSequenceControls(my_map, attributes);
            createLegend(my_map, attributes);
        }
    });
};

function create_map() {
    location.reload();
};

$(document).ready(createMap);
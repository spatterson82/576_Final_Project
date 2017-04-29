(function() {
    'use strict';

    function createMap() {
        // Function to create map, set tiles, and add CSV data

        var map = L.map('mapid', {
            center: [43.02, -71.1],
            zoom: 11
        });

        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BhdHRlcnNvbjgiLCJhIjoiY2lzZzBnbmlxMDFzNjJzbnZ1cXJ0bDJ5cSJ9.r_0eIQ9LIuNS3LV-GL1AIg').addTo(map);


        var house_icon = L.icon({
            iconUrl: 'img/blue_house.png',

            iconSize:     [26, 26], // size of the icon
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -90] // point from which the popup should open relative to the iconAnchor
        });


        $.get('data/listings.csv', function (csvContents) {
            var geoLayer = L.geoCsv(csvContents, {
                firstLineTitles: true,
                fieldSeparator: ',',
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(createPopup(feature));
                    layer.on('mouseover', function (e) {
                        this.openPopup();
                    }),
                    layer.on('mouseout', function (e) {
                        layer.closePopup();
                    });
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: house_icon});
                }
            });
            map.addLayer(geoLayer);
        });

        set_query_items();
    }


    function createPopup(feature) {
        // Function to create the pop up HTML layout

        var prop = feature.properties;
        var full_address = prop['address'] + ' ' + prop['city'] + ', ' +
            prop['state'] + ' ' + prop['zip'];

        var currency = prop['price2'].split(';').join(',');

        var pop_up = L.popup()
            .setContent('<p>' + full_address +
                '<br />Listing Price: ' + currency +
                '<br /><a href="' + prop['listing'] + '" target="_blank">View Full Listing</a>' +
                '<br /><img src="' + prop['photo'] + '" height="200" width="200"></p>');

        return pop_up;

        // $(pop_up).click(function(){
        //     $("#AddressResult").text(prop['address'])
        //     $("#PriceResult").text(prop['price2'])
        //     $("#CityResult").text(prop['city'])
        //     $("#ZipResult").text(prop['zip'])
        //     $("#Picture").attr({"img": prop['photo']})
        // });
    };


    function set_query_items() {
        // Load city and zip options
        var cities = [];
        var zipcodes = [];
        $.get('data/listings.csv', function (result) {
            var csv_results = result.split(/\r\n|\n/);
            csv_results = csv_results.slice(1, csv_results.length)
            for (var i in csv_results) {
                var row = csv_results[i].split(',');
                cities.push(row[2]);
                zipcodes.push(row[4]);
            }
            var sorted_cities = sort_unique(cities);
            var sorted_zipcodes = sort_unique(zipcodes);

            var cities_output = [];
            cities_output.push('<option value="city-entry" disabled selected hidden>Select</option>')
            for (var i in sorted_cities) {
                cities_output.push('<option value="city-entry', '">',
                    sorted_cities[i], '</option>');
            }

            var zipcodes_output = [];
            zipcodes_output.push('<option value="zip-entry" disabled selected hidden>Select</option>')
            for (var i in sorted_zipcodes) {
                zipcodes_output.push('<option value="zip-entry', '">',
                    sorted_zipcodes[i], '</option>');
            }

            $("#city-select").html(cities_output.join('')).prop('disabled', false).css('background-color', 'white');
            $("#zip-select").html(zipcodes_output.join('')).prop('disabled', false).css('background-color', 'white');
        });
    }

    function sort_unique(arr) {
        // function to sort an array and only keep unique values
        if (arr.length === 0) return arr;
        arr = arr.sort(function (a, b) { return a*1 - b*1; });
        var ret = [arr[0]];
        for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
            if (arr[i-1] !== arr[i]) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }


    // disable other select if option is chosen
    $("#city-select").change(function() {
       $('#zip-select').prop('disabled', true);
       $('#zip-select').css('background-color', 'lightgrey');
    });
    $("#zip-select").change(function() {
        $('#city-select').prop('disabled', true);
        $('#city-select').css('background-color', 'lightgrey');
    });

    // reset button to set query back to default
    $('#reset').on('click', function() {
        set_query_items();
    })



    $(document).ready(createMap);


    // $(document).click(function(){
    //         $("#AddressResult").text(prop['address'])
    //         $("#PriceResult").text(prop['price2'])
    //         $("#CityResult").text(prop['city'])
    //         $("#ZipResult").text(prop['zip'])
    //         $("#Picture").attr({"img": prop['photo']})
    //     });

})();
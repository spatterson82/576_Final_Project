(function() {
    'use strict';

    function createMap() {
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
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: house_icon});
                }
            });
            map.addLayer(geoLayer);
        });
    }


    function createPopup(feature) {
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
    };


    $(document).ready(createMap);

})();
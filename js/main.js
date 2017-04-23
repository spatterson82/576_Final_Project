(function() {
    'use strict';

    function createMap() {
        var map = L.map('mapid', {
            center: [43.02, -71.1],
            zoom: 11
        });
        //add OSM base tilelayer
        // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'
        // L.tileLayer('http://{s}.tiles.mapbox.com/v3/isawnyu.map-knmctlkh/{z}/{x}/{y}.png').addTo(map);
        // L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BhdHRlcnNvbjgiLCJhIjoiY2lzZzBnbmlxMDFzNjJzbnZ1cXJ0bDJ5cSJ9.r_0eIQ9LIuNS3LV-GL1AIg').addTo(map);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3BhdHRlcnNvbjgiLCJhIjoiY2lzZzBnbmlxMDFzNjJzbnZ1cXJ0bDJ5cSJ9.r_0eIQ9LIuNS3LV-GL1AIg').addTo(map);
        var house_icon = L.icon({
            iconUrl: 'img/house.png',

            iconSize:     [24, 24], // size of the icon
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        $.get('data/listings.csv', function (csvContents) {
            var geoLayer = L.geoCsv(csvContents, {
                firstLineTitles: true,
                fieldSeparator: ',',
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties["price"]);
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: house_icon});
                }
            });
            map.addLayer(geoLayer);
        });
    }

    $(document).ready(createMap);

})();
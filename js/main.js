(function() {
    'use strict';

    function createMap() {
        var map = L.map('mapid', {
            center: [43.02, -71.1],
            zoom: 11
        });
        //add OSM base tilelayer
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        var house_icon = L.icon({
            iconUrl: 'img/house.png',

            iconSize:     [30, 30], // size of the icon
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        $.get('data/listings.csv', function (csvContents) {
            var geoLayer = L.geoCsv(csvContents, {
                firstLineTitles: true,
                fieldSeparator: ',',
                onEachFeature: function (feature, layer) {
                    console.log(feature);
                    layer.bindPopup(feature.properties["price"]);
                },
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: house_icon});
                }
            });
            console.log(geoLayer);
            map.addLayer(geoLayer);
        });
    }

    $(document).ready(createMap);

})();
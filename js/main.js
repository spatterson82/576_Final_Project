(function() {
    'use strict';

    function createMap() {
        var map = L.map('mapid', {
            center: [43, -71],
            zoom: 11
        });
        //add OSM base tilelayer
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        $.get('data/listings.csv', function (csvContents) {
            var geoLayer = L.geoCsv(csvContents, {firstLineTitles: true, fieldSeparator: ','});
            console.log(geoLayer);
            map.addLayer(geoLayer);
        });
    }


    $(document).ready(createMap);

})();
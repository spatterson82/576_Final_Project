var mymap = L.map('mapid').setView([39.75621, -104.99404], 8);

// mapbox tiles
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.satellite',
//     accessToken: 'pk.eyJ1Ijoic3BhdHRlcnNvbjgiLCJhIjoiY2lzZzBnbmlxMDFzNjJzbnZ1cXJ0bDJ5cSJ9.r_0eIQ9LIuNS3LV-GL1AIg'
// }).addTo(mymap);

//openstreetmap tiles
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(mymap);

//GeoJSON tutorial
var geojsonFeature = {
    "type" : "Feature",
    "properties" : {
        "name" : "Coors Field",
        "amenity" : "Baseball Stadium",
        "popupContent" : "This is where the Rockies play!"
    },
    "geometry" : {
        "type" : "Point",
        "coordinates" : [-104.99404, 39.75621]
    }
};
// L.geoJSON(geojsonFeature).addTo(mymap);

//empty geoJSON
var mylayer = L.geoJSON().addTo(mymap);
// mylayer.addData(geojsonFeature);

// var myLines = [{
//     "type": "LineString",
//     "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
// }, {
//     "type": "LineString",
//     "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// }];

// var myStyle = {
//     "color" : "#ff7800",
//     "weight" : 5,
//     "opacity" : 0.65
// };

// L.geoJSON(myLines, {
//     style : myStyle
// }).addTo(mymap);

// var states = [{
//     "type" : "Feature",
//     "properties" : {"party" : "Republican"},
//     "geometry" : {
//         "type" : "Polygon",
//         "coordinates" : [[
//             [-104.05, 48.99],
//             [-97.22, 48.98],
//             [-96.58, 45.94],
//             [-104.03, 45.94],
//             [-104.05, 48.99]
//         ]]
//     }
// }, {
//     "type" : "Feature",
//     "properties" : {"party" : "Democrat"},
//     "geometry" : {
//         "type" : "Polygon",
//         "coordinates" : [[
//             [-109.05, 41.00],
//             [-102.06, 40.99],
//             [-102.03, 36.99],
//             [-109.04, 36.99],
//             [-109.05, 41.00]
//         ]]
//     }
// }];

// L.geoJSON(states, {
//     style: function(feature) {
//         switch (feature.properties.party) {
//             case 'Republican': return {color : "#ff0000"};
//             case 'Democrat' : return {color : "#0000ff"};
//         }
//     }
// }).addTo(mymap);

// point Markers
// var geojsonMarkerOptions = {
//     radious : 8,
//     fillColor : "#ff7800",
//     color : "#000",
//     weight : 1,
//     opacity : 1,
//     fillOpacity : 0.8
// };

// L.geoJSON(somegeojsonfeature, {
//     pointToLayer : function (feature, latlng) {
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//     }
// }).addTo(mymap);

function onEachFeature(feature, layer) {
    // check if feature has a property named "Popup"
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

L.geoJSON(someFeatures, {
    onEachFeature: onEachFeature
}).addTo(mymap);

//filters
var someFeatures = [{
    "type" : "Feature",
    "properties" : {
        "name" : "Coors Field",
        "show_on_map" : true
    }, 
    "geometry" : {
        "type" : "Point",
        "coordinates" : [-104.99404, 39.75621]
    }
}, {
    "type" : "Feature",
    "properties" : {
        "name" : "Busch Field",
        "show_on_map" : false
    },
    "geometry" : {
        "type" : "Point",
        "coordinates" : [-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, {
    filter : function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);
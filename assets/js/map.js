let osm = new ol.layer.Tile({
    visible: true,
    source: new ol.source.OSM()
});
let colombiaBoundary = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm0', 'STYLES': 'restricted' }
    })
});
var colombiaDepartments = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm1' }
    }),
    opacity: 0.5
});

var colombiaRoads = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_roads' }
    }),
    visible: false
});
var colombiaRivers = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_rivers' }
    }),
    minResolution: 1000,
    maxResolution: 5000
});

//Create the layer groups and add the layers to them



let map = new ol.Map({
    target: document.getElementById('map'),
    layers: [osm, colombiaDepartments, colombiaRivers, colombiaRoads],
    view: new ol.View({
        center: ol.proj.fromLonLat([-74, 4.6]),
        zoom: 5
    })
});

// Add the map controls:


//OPTIONAL
//Add the Bing Maps layers


//Add the Stadia base layers


//Add the WFS layer


//Add the code for the Pop-up


// Adding map event for pointermove
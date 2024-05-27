let osm = new ol.layer.Tile({
    title: "Open Street Map",
    type: "base",
    visible: true,
    source: new ol.source.OSM()
});
let colombiaBoundary = new ol.layer.Image({
    title: "Colombia Boundary",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm0', 'STYLES': 'restricted' }
    })
});
var colombiaDepartments = new ol.layer.Image({
    title: "Colombia Departments",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm1' }
    }),
    opacity: 0.5
});

var colombiaRoads = new ol.layer.Image({
    title: "Colombia Roads",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_roads' }
    }),
    visible: false
});
var colombiaRivers = new ol.layer.Image({
    title: "Colombia Rivers",
    source: new ol.source.ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_rivers' }
    }),
    minResolution: 1000,
    maxResolution: 5000
});

//Create the layer groups and add the layers to them
let basemapLayers = new ol.layer.Group({
    title: "Base Maps",
    layers: [osm]
});
let overlayLayers = new ol.layer.Group({
    title: "Overlay Layers",
    layers: [colombiaDepartments, colombiaRivers, colombiaRoads]
})

// Map Initialization
let map = new ol.Map({
    target: document.getElementById('map'),
    layers: [basemapLayers, overlayLayers],
    view: new ol.View({
        center: ol.proj.fromLonLat([-74, 4.6]),
        zoom: 5
    })
});

// Add the map controls:
map.addControl(new ol.control.ScaleLine()); //Controls can be added using the addControl() map function
map.addControl(new ol.control.FullScreen());
map.addControl(
    new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-control',
        placeholder: '0.0000, 0.0000'
    })
);

//Add the layer switcher control
var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);

//OPTIONAL
//Add the Bing Maps layers
var BING_MAPS_KEY = "Get_your_own_key";
var bingRoads = new ol.layer.Tile({
    title: 'Bing Maps—Roads',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: BING_MAPS_KEY,
        imagerySet: 'Road'
    })
});
var bingAerial = new ol.layer.Tile({
    title: 'Bing Maps—Aerial',
    type: 'base',
    visible: false,
    source: new ol.source.BingMaps({
        key: BING_MAPS_KEY,
        imagerySet: 'Aerial'
    })
});
basemapLayers.getLayers().extend([bingRoads, bingAerial]);

//Add the Stadia Maps layers
var stadiaWatercolor = new ol.layer.Tile({
    title: "Stadia Watercolor",
    type: "base",
    visible: false,
    source: new ol.source.StadiaMaps({
        layer: 'stamen_watercolor'
    })
})
var stadiaToner = new ol.layer.Tile({
    title: "Stadia Toner",
    type: "base",
    visible: false,
    source: new ol.source.StadiaMaps({
        layer: 'stamen_toner'
    })
})
basemapLayers.getLayers().extend([stadiaWatercolor, stadiaToner]);

//Add the WFS layer
let vectorSource = new ol.source.Vector({});
const vectorLayer = new ol.layer.Vector({
    title: "Colombia water areas",
    source: vectorSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgb(255, 102, 0)',
            width: 4
        })
    }),
    zIndex: 10
});
overlayLayers.getLayers().extend([vectorLayer]);


// This allows to use the function in a callback!
function loadFeatures(response) {
    vectorSource.addFeatures(new ol.format.GeoJSON().readFeatures(response))
}

var base_url = "https://www.gis-geoserver.polimi.it/geoserver/gis/ows?";
var wfs_url = base_url;
wfs_url += "service=WFS&"
wfs_url += "version=2.0.0&"
wfs_url += "request=GetFeature&"
wfs_url += "typeName=gis%3ACOL_water_areas&"
wfs_url += "outputFormat=text%2Fjavascript&"
wfs_url += "srsname=EPSG:3857&"
wfs_url += "format_options=callback:loadFeatures"

// This will request the WFS layer once the map is rendered.
// Uses the map event 'postrender': https://openlayers.org/en/v8.2.0/apidoc/module-ol_MapEvent-MapEvent.html#event:postrender
map.once('postrender', (event) => {
    // Load the WFS layer
    $.ajax({ url: wfs_url, dataType: 'jsonp' });
})

//Add the code for the Pop-up
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container
});
map.addOverlay(popup);

// This ensures that JQuery ($) is already available in the page.
$(document).ready(function () {
    map.on('singleclick', function (event) {
        //This iterates over all the features that are located on the pixel of the click (can be many)
        var feature = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
            return feature;
        });

        //If there is a feature, open the popup by setting a position to it and put the data from the feature
        if (feature != null) {
            var pixel = event.pixel;
            var coord = map.getCoordinateFromPixel(pixel);
            popup.setPosition(coord);
            content.innerHTML =
                '<h5>Colombia Water Areas</h5><br><b>Name: </b>' +
                feature.get('NAME') +
                '</br><b>Description: </b>' +
                feature.get('HYC_DESCRI');
        } else {
            //Only if the colombiaRoads layer is visible, do the GetFeatureInfo request
            if (colombiaRoads.getVisible()) {
                var viewResolution = (map.getView().getResolution());
                var url = colombiaRoads.getSource().getFeatureInfoUrl(event.coordinate, viewResolution, 'EPSG:3857', { 'INFO_FORMAT': 'text/html' });

                if (url) {
                    var pixel = event.pixel;
                    var coord = map.getCoordinateFromPixel(pixel);
                    popup.setPosition(coord);
                    //We do again the AJAX request to get the data from the GetFeatureInfo request
                    $.ajax({ url: url })
                        .done((data) => {
                            //Put the data of the GetFeatureInfo response inside the pop-up
                            //The data that arrives is in HTML
                            content.innerHTML = data;
                        });
                }
            }
        }
    });
});


// The click event handler for closing the popup.
closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};


// Adding map event for pointermove
map.on('pointermove', function (event) {
    var pixel = map.getEventPixel(event.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});

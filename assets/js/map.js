import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import { Map, View, Overlay } from 'ol';
import { Tile, Image, Group, Vector } from 'ol/layer';
import { OSM, ImageWMS, BingMaps, StadiaMaps } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { fromLonLat } from 'ol/proj';
import { ScaleLine, FullScreen, OverviewMap, MousePosition } from 'ol/control';
import LayerSwitcher from 'ol-layerswitcher';
import { createStringXY } from 'ol/coordinate';
import { Style, Stroke } from 'ol/style';

let osm = new Tile({
    title: "Open Street Map",
    visible: true,
    source: new OSM()
});
let colombiaBoundary = new Image({
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm0', 'STYLES': 'restricted' }
    })
});
var colombiaDepartments = new Image({
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_adm1' }
    }),
    opacity: 0.5
});

var colombiaRoads = new Image({
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_roads' }
    }),
    visible: false
});
var colombiaRivers = new Image({
    source: new ImageWMS({
        url: 'https://www.gis-geoserver.polimi.it/geoserver/wms',
        params: { 'LAYERS': 'gis:COL_rivers' }
    }),
    minResolution: 1000,
    maxResolution: 5000
});

//Create the layer groups and add the layers to them
let basemapLayers = new Group({
    title: "Base Maps",
    layers: [osm]
});
let overlayLayers = new Group({
    title: "Overlay Layers",
    layers: [colombiaDepartments, colombiaRivers, colombiaRoads]
})

// Map Initialization
let map = new Map({
    target: document.getElementById('map'),
    layers: [basemapLayers, overlayLayers],
    view: new View({
        center: fromLonLat([-74, 4.6]),
        zoom: 5
    })
});

// Add the map controls:


//OPTIONAL
//Add the Bing Maps layers
var BING_MAPS_KEY = "YOUR_KEY";

//Add the Stadia Maps layers
var STADIA_MAPS_KEY = "YOUR_KEY";


//Add the WFS layer


//Add the code for the Pop-up


//Add a map singleclick event



//Adding map event for pointermove

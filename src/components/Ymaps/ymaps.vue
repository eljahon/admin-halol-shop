<script setup>
import { computeArea, LatLng } from 'spherical-geometry-js';
import { computed, onMounted, reactive, ref, toRef, watch } from 'vue';
import ymaps from 'ymaps';
import iconPoligon from '@/assets/image/poligon.png';
import iconPoligonEdit from '@/assets/image/edits.png';
import iconPoligonDelete from '@/assets/image/delete.png';
import { useRoute } from 'vue-router';
let defaultMap = {
    api: 'https://api-maps.yandex.ru/2.1/?apikey=8fb635ed-f033-4166-8286-a5388bb7d9a9&lang=ru_RU',
    // apiKey: '8fb635ed-f033-4166-8286-a5388bb7d9a9',
    center: [41.312947, 69.280204],
    home: [41.324174, 69.29013],
    Map: {
        center: [41.312947, 69.280204],
        zoom: 13,
        type: 'yandex#hybrid',
        controls: ['zoomControl', 'searchControl']
    }
};

const coordinates = ref([]);
let mapRef = reactive(null);
let mapsRef = reactive(null);
let myPolygonRef = reactive(null);
let route = useRoute();
let objectManagerRef = reactive(null);
let addButtonPoligon = reactive(null);
let removeButtonPoligon = reactive(null);
let editButtonPoligon = reactive(null);
let addres = ref([]);

const props = defineProps({
    isPoligonAdd: {
        type: Boolean,
        required: false,
        default: false
    },
    height:{
        type: String,
        default: () => 800+'px'
    },

    layers: {
        type: Array,
        required: false,
        default: () => []
    },

    poligons: {
        type: Array,
        required: false,
        default: () => []
    },
    zoom: {
        type: Number,
        required: false,
        default: 13
    },

    width: {
        type: Number,
        required: false,
        default: 100
    },
    center: {
        type: Array,
        required: false,
        default: () => []
    }
});

const emit = defineEmits(['cropCoords']);

let fec = {
    type: 'Feature',
    geometry: {
        coordinates: undefined,
        type: 'Polygon'
    },
    properties: {
        name: 'salom'
    }
};

const getLocationName = async (coords) => {
    try {
        const data = await axios_init.get('https://geocode-maps.yandex.ru/1.x/', {
            format: 'json',
            apikey: '1abe9aa1-66ec-4c7f-8b93-a4e0bc25319e',
            sco: 'latlong',
            lang: 'ru-RU',
            results: 5,
            ll: '69.241320,41.292906',
            spn: '6.5,6.5',
            rspn: 1,
            geocode: `${coords[0]},${coords[1]}`
        });
        addres.value = [];
        data.response.GeoObjectCollection.featureMember.reverse().forEach((el) => {
            addres.value.push(el.GeoObject.name);
        });
    } catch (err) {
        console.log('Error: ', err);
        throw new Error(err);
    }
};

function mapAddPolygon(maps, map, arr) {
    arr.forEach((el, index) => {
        let { properties, geometry } = JSON.parse(JSON.stringify(el.polygon));
        properties['balloonContent'] = el.name;
        let myGeoObject = new mapsRef.GeoObject(
            {
                geometry,
                properties
            },
            {
                fillColor: el.fid === +route.query?.fid ?'#C3FF93': '#F3CA52' ,
                strokeColor: el.fid === +route.query?.fid ? '#F6EEC9': '#799351' ,
                opacity: 0.6,
                strokeWidth: 3,
                strokeOpacity: 1
            }
        );
        mapRef.geoObjects.add(myGeoObject);
    });
}
function removePoligon() {
    if (objectManagerRef) mapRef.geoObjects.remove(objectManagerRef);

    fec.geometry.coordinates = undefined;

    startPolygonDrawing();

    emit('cropCoords', undefined);
}

function getArea(polygonArray) {
    let coords = [];

    polygonArray.forEach((el) => {
        el.forEach((e) => {
            coords.push({ lat: e[0], lng: e[1] });
        });
    });

    let latLngs = coords.map(function (coord) {
        return new LatLng(coord.lat, coord.lng);
    });

    return computeArea(latLngs);
}
function editPoligon() {
    if (objectManagerRef) mapRef.geoObjects.remove(objectManagerRef);

    startPolygonDrawing(fec.geometry.coordinates);

    emit('cropCoords', []);
}
function startPolygonDrawing(coords) {
    if (objectManagerRef) mapRef.geoObjects.remove(objectManagerRef);

    emit('cropCoords', { polygon: [], zoom: undefined, center: undefined, hectar: undefined });

    // if(myPolygonRef) myPolygonRef.editor.stopDrawing();

    const myPolygon = new mapsRef.Polygon(
        coords?.length ? coords : [],
        {
            allowIntersection: false
        },
        {
            editorDrawingCursor: 'crosshair',

            editorMaxPoints: 1000,

            opacity: 0.5,

            strokeColor: '#0000FF',

            strokeWidth: 4
            // fillImageHref: 'https://www.fnordware.com/superpng/pnggradHDrgba.png',
            // fillMethod: 'stretch'
        }
    );

    mapRef.geoObjects.add(myPolygon);

    myPolygonRef = myPolygon;

    const stateMonitor = new mapsRef.Monitor(myPolygon.editor.state);

    stateMonitor.add('drawing', function (newValue) {
        myPolygon.options.set('strokeColor', newValue ? '#fff300' : '#ffcc00');
    });

    myPolygonRef.editor.startDrawing();

    myPolygonRef.editor.events.add('drawingstop', (val) => {
        let objectManager = new mapsRef.ObjectManager();

        fec.geometry.coordinates = myPolygon.geometry.getCoordinates();

        objectManager.add(fec);

        mapRef.geoObjects.add(objectManager);

        objectManagerRef = objectManager;

        myPolygonRef.editor.stopDrawing();

        mapRef.geoObjects.remove(myPolygonRef);

        if (!removeButtonPoligon) handleMapAddButtonPoligonRemove();

        if (!editButtonPoligon) handleMapAddButtonPoligonEdit();
        const polygons = myPolygonRef.geometry.getCoordinates();

        emit('cropCoords', {
            polygon: polygons,
            zoom: mapRef.getZoom(),
            center: mapRef.getCenter(),
            hectar: getArea(polygons)
        });
    });
}

function handleMapAddButtonPoligonRemove() {
    removeButtonPoligon = new mapsRef.control.Button({
        data: {
            content: '<img src="' + iconPoligonDelete + '" style="width: 15px; height: 15px; margin-top: 5px">'
        },

        options: {
            maxWidth: [28, 150, 178]
        }
    });

    removeButtonPoligon.events.add('click', removePoligon);

    mapRef.controls.add(removeButtonPoligon, { float: 'right' });
}

function handleMapAddButtonPoligonEdit() {
    editButtonPoligon = new mapsRef.control.Button({
        data: {
            content: '<img src="' + iconPoligonEdit + '" style="width: 15px; height: 15px; margin-top: 5px">'
        },

        options: {
            maxWidth: [28, 150, 178]
        }
    });

    editButtonPoligon.events.add('click', editPoligon);

    mapRef.controls.add(editButtonPoligon, { float: 'right' });
}
watch(
    () => props.isPoligonAdd,
    (newValue, oldValue) => {
        if (newValue && !addButtonPoligon) {
            handleMapAddButtonPoligon();
        }
    }
);
watch(
    () => props.poligons,
    (newValue, oldValue) => {
        if (newValue.length) {
            mapAddPolygon(mapsRef, mapRef, newValue);
        }
    }
);
async function handleMapAddButtonPoligon() {
    addButtonPoligon = await new mapsRef.control.Button({
        data: {
            content: '<img src="' + iconPoligon + '" style="width: 15px; height: 15px; margin-top: 5px">'
        },

        options: {
            maxWidth: [28, 150, 178]
        }
    });

    addButtonPoligon.events.add('click', startPolygonDrawing);

    mapRef.controls.add(addButtonPoligon, { float: 'right' });

    startPolygonDrawing();
}

async function initMap() {
    mapsRef = await ymaps.load(defaultMap.api);

    mapRef = new mapsRef.Map(document.getElementById('map'), { ...defaultMap.Map, center: props.center?.length ? props.center : [41.312947, 69.280204], zoom: props.zoom }, { earchControlProvider: 'yandex#search' });

    mapRef.container.fitToViewport();

    // let polygonList = props?.poligons;

    // if(polygonList.length) mapAddPolygon(mapsRef, mapRef, polygonList)

    // rendetLayers()
}

// function rendetLayers (arr) {
//
//     //   const tileLayer = new  mapsRef.Layer('https://api.agromonitoring.com/image/1.0/12066230580/6620f23c93997d7f52bfed1e?appid=aa4582653f9fb09732af4d4aae203b2c', {
//     //     projection: mapsRef.projection.sphericalMercator,
//     //     tileTransparent: true
//     // })
//
//
//     var agroMonitoringTileLayer = new mapsRef.Layer('https://api.agromonitoring.com/tile/1.0/{z}/{x}/{y}/12066230580/6620f23c93997d7f52bfed1e?appid=aa4582653f9fb09732af4d4aae203b2c', {
//         projection: mapsRef.projection.sphericalMercator,
//         tileTransparent: true
//     });
//
//     // Create a tile source
//     var agroMonitoringTileSource = new mapsRef.Layer('agroMonitoringLayer', agroMonitoringTileLayer, {
//         zIndex: 100
//     });
//
//     // Add the tile source to the map
//     mapRef.layers.add(agroMonitoringTileSource);
//     // mapRef.layers.tile.CanvasTile('https://api.agromonitoring.com/image/1.0/12066230580/6620f23c93997d7f52bfed1e?appid=aa4582653f9fb09732af4d4aae203b2c')
// }
onMounted(() => {
    initMap();
});
</script>

<template title="yandex-map" style="width: 100%">
    <h3 class="mt-3 mb-5">{{ addres.join(', ') }}</h3>
    <div ref="basicMap" id="map" style="width: 100%" :style="{height}"></div>
</template>

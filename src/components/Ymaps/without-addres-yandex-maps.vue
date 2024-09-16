<script setup>
import { onMounted, ref } from 'vue';
import ymaps from 'ymaps';
import axios_init from '@/utils/request';

const map = ref(null);
const maps = ref(null);
let placemarkCoords = ref([]);
const emits = defineEmits(['getLocation']);
const props = defineProps({ getLocation: Function, coordinata: Array });
let addres = ref([]);

const getLocationName = async (coords, e) => {
    try {
        const data = await axios_init.get('https://geocode-maps.yandex.ru/1.x/', {
            params:{
                format: 'json',
                apikey: '1abe9aa1-66ec-4c7f-8b93-a4e0bc25319e',
                sco: 'latlong',
                lang: 'ru-RU',
                results: 5,
                ll: '69.241320,41.292906',
                spn: '6.5,6.5',
                rspn: 1,
                geocode: coords
            }
        });
        addres.value = [];
        data.response.GeoObjectCollection.featureMember.reverse().forEach((el) => {
            addres.value.push(el.GeoObject.name);
        });
        if (e) props.getLocation(e.get('coords'), addres.value.join(', '));
    } catch (err) {
        console.log('Error: ', err);
        throw new Error(err);
    }
};
onMounted(() => {
    ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=8fb635ed-f033-4166-8286-a5388bb7d9a9&lang=ru_RU').then((res) => {
        maps.value = res;
        const myMap = new res.Map(
            document.getElementById('map'),
            {
                center: [41.312947, 69.280204],
                zoom: 13,
                controls: ['zoomControl', 'fullscreenControl', 'smallMapDefaultSet', 'searchControl']
            },
            {
                searchControlProvider: 'yandex#search'
            }
        );
        map.value = myMap;
        setTimeout(() => {
            if (props.coordinata.length) {
                placemarkCoords.value = props.coordinata;
                const myPlacemark = new maps.value.Placemark(placemarkCoords.value, {
                    balloonContentHeader: 'The placemark balloon',
                    balloonContentBody: 'Content of the <em>placemark</em> balloon',
                    balloonContentFooter: 'Basement',
                    hintContent: 'Ваша место'
                });
                myMap.geoObjects.add(myPlacemark);
                const _addresCoords = `${placemarkCoords.value[0]},${placemarkCoords.value[1]}`;
                getLocationName(_addresCoords);
            }
        }, 1000);

        myMap.events.add('click', (e) => {
            placemarkCoords.value = e.get('coords');
            let coords = `${e.get('coords')[0]},${e.get('coords')[1]}`;
            getLocationName(coords, e);
            const myPlacemark = new maps.value.Placemark(placemarkCoords.value, {
                balloonContentHeader: 'The placemark balloon',
                balloonContentBody: 'Content of the <em>placemark</em> balloon',
                balloonContentFooter: 'Basement',
                hintContent: 'The placemark hint'
            });

            myMap.geoObjects.remove(myMap.geoObjects.get(0));
            myMap.geoObjects.add(myPlacemark);
        });
    });
});
</script>

<template title="yandex-map" style="width: 100%">
    <div ref="basicMap" id="map" style="height: 250px; width: 100% !important"></div>
</template>

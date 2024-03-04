
        
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [71.5249, 30.1575], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

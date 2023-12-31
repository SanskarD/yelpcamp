
console.log( campground.geometry)
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl())

const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:10})
    .setHTML(`<h5>${campground.title}</h3>
    <p>${campground.location}</p>`)
  )
  .addTo(map);

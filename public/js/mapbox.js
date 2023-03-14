/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicHJvYXJiYXoxOTk5IiwiYSI6ImNsZjZyazYxYTE5MXMzdG8xaDNvOTB4bXIifQ.rtKx-V7QbTQYYBX_0t_ZHw';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/proarbaz1999/clf6w67gj008n01nhv7gy6r5a',
    center: [-118.113491, 34.111745],
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}:${loc.description}</p>`)
      .addTo(map);

    //Extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

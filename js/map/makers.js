import { map } from "./mapInit.js";

let markers = [];

export function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

export function addMarker(lat, lng, popup) {
  const marker = L.marker([lat, lng]).addTo(map).bindPopup(popup);
  markers.push(marker);
  return marker;
}

// js/map/markers.js
import { map, clearMarkers as _clearMarkers, addMarker as _addMarker } from "../core/state.js";

export function clearMap() {
  _clearMarkers();
  const list = document.getElementById("list");
  if (list) list.innerHTML = "";
}

export function addMarker(lat, lng, popupHtml = null, open = false) {
  let marker = L.marker([lat, lng]).addTo(map);
  if (popupHtml) {
    marker = marker.bindPopup(popupHtml);
    if (open) marker.openPopup();
  }
  _addMarker(marker);
}

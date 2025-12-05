// js/core/state.js
export let map = null;
export let markers = [];
export let seatTimers = {};
export let REAL_PCBANGS = [];

export function setMap(newMap) {
  map = newMap;
}

export function setPCBangData(data) {
  REAL_PCBANGS = data;
}

export function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

export function addMarker(marker) {
  markers.push(marker);
}

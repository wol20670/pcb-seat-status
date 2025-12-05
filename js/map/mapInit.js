// js/map/mapInit.js
import { setMap } from "../core/state.js";

export function initMap() {
  const map = L.map("map").setView([37.5665, 126.978], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  setMap(map);
  return map;
}

export let map = null;

export function initMap() {
  map = L.map("map").setView([37.5665, 126.978], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  return map;
}

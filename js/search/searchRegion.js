import { calculateDistance } from "../map/distance.js";
import { addMarker, clearMarkers } from "../map/markers.js";
import { renderList } from "../ui/listRenderer.js";
import { REAL_PCBANGS } from "../api/pcbangAPI.js";
import { map } from "../map/mapInit.js";

export async function searchByRegion(query) {
  const normalized = query.replace(/\s+/g, "").toLowerCase();
  clearMarkers();

  let res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );
  let data = await res.json();
  if (!data.length) return alert("검색 결과가 없습니다.");

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);

  map.setView([lat, lng], 15);
  addMarker(lat, lng, `검색 위치: ${query}`).openPopup();

  let pcList = REAL_PCBANGS.map(pc => ({
    ...pc,
    distance: calculateDistance(lat, lng, pc.lat, pc.lng),
  })).sort((a, b) => a.distance - b.distance);

  renderList(`${query} 주변 PC방`, pcList);
}

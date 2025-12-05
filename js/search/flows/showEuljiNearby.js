// js/search/flows/showEuljiNearby.js
import { REAL_PCBANGS, map } from "../../core/state.js";
import { clearMap, addMarker } from "../../map/markers.js";
import { calculateDistance } from "../../core/utils.js";

export function showEuljiNearby(lat, lng, query) {
  clearMap();
  map.setView([lat, lng], 15);

  addMarker(lat, lng, `검색 위치: ${query}`, true);

  const oneTop = REAL_PCBANGS.find(p => p.name.includes("원탑PC방"));
  const dist = calculateDistance(lat, lng, oneTop.lat, oneTop.lng);

  addMarker(oneTop.lat, oneTop.lng, `${oneTop.name}<br>좌석 ${oneTop.available}/${oneTop.total}`);

  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;

  const div = document.createElement("div");
  div.className = "pcbang-card";
  div.innerHTML = `
    <h3>${oneTop.name}</h3>
    <p class="status">좌석 현황: ${oneTop.available}/${oneTop.total}</p>
    <p class="status">거리: ${Math.round(dist)}m</p>
    <button onclick="openModal('${oneTop.id}', '${oneTop.name}')">좌석 보기</button>`;
  list.appendChild(div);
}

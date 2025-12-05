// js/search/flows/showSinglePC.js
import { map } from "../../core/state.js";
import { clearMap, addMarker } from "../../map/markers.js";

export function showSinglePC(pc) {
  clearMap();
  map.setView([pc.lat, pc.lng], 17);

  addMarker(
    pc.lat,
    pc.lng,
    `${pc.name}<br>좌석 ${pc.available}/${pc.total}`,
    true
  );

  const list = document.getElementById("list");
  list.innerHTML = `
    <div class="pcbang-card">
      <h3>${pc.name}</h3>
      <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
      <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>
    </div>`;
}

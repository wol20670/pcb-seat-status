// js/search/flows/showSinglePC.js
import { map } from "../../core/state.js";
import { addMarker, clearMap } from "../../map/markers.js";
import { getAddress, cleanAddress } from "../../core/utils.js";

export async function showSinglePC(pc) {
  clearMap();
  map.setView([pc.lat, pc.lng], 17);

  const rawAddress = await getAddress(pc.lat, pc.lng);
  const address = cleanAddress(rawAddress);

  addMarker(
    pc.lat,
    pc.lng,
    `${pc.name}<br>${address}<br>좌석 ${pc.available}/${pc.total}`
  );

  const list = document.getElementById("list");
  list.innerHTML = `
    <div class="pcbang-card">
      <h3>${pc.name}</h3>
      <p class="status">주소: ${address}</p>
      <p class="status">남은 좌석 현황: ${pc.available} / ${pc.total}</p>
      <button onclick="openModal('${pc.id}', '${pc.name}', ${pc.available}, ${pc.total})">
        좌석 보기
      </button>
    </div>
  `;
}

// js/search/flows/showEuljiNearby.js
import { map } from "../../core/state.js";
import { addMarker, clearMap } from "../../map/markers.js";
import { calculateDistance, getAddress, cleanAddress } from "../../core/utils.js";
import { REAL_PCBANGS } from "../../core/state.js";

export async function showEuljiNearby(lat, lng, query) {
  clearMap();
  map.setView([lat, lng], 15);

  addMarker(lat, lng, `검색 위치: ${query}`, true);

  // 원탑PC방 데이터 찾기
  const oneTop = REAL_PCBANGS.find(p => p.name.includes("원탑"));

  if (!oneTop) {
    console.error("❌ 원탑PC방 데이터가 없습니다.");
    return;
  }

  // 거리 계산
  const dist = calculateDistance(lat, lng, oneTop.lat, oneTop.lng);

  // ★ 주소 가져오기 + 정리 (핵심!)
  const rawAddress = await getAddress(oneTop.lat, oneTop.lng);
  const address = cleanAddress(rawAddress);

  // 마커 표시
  addMarker(
    oneTop.lat,
    oneTop.lng,
    `${oneTop.name}<br>${address}<br>좌석 ${oneTop.available}/${oneTop.total}`
  );

  // 리스트 렌더링
  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;

  const div = document.createElement("div");
  div.className = "pcbang-card";
  div.innerHTML = `
    <h3>${oneTop.name}</h3>
    <p class="status">주소: ${address}</p>
    <p class="status">좌석 현황: ${oneTop.available} / ${oneTop.total}</p>
    <p class="status">거리: ${Math.round(dist)}m</p>
    <button onclick="openModal('${oneTop.id}', '${oneTop.name}')">좌석 보기</button>
  `;

  list.appendChild(div);
}

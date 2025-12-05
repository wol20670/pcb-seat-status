// js/search/flows/showNearby.js
import { map } from "../../core/state.js";
import { addMarker, clearMap } from "../../map/markers.js";
import { calculateDistance, getAddress } from "../../core/utils.js";

export async function showNearby(lat, lng, query) {
  clearMap();
  map.setView([lat, lng], 15);

  addMarker(lat, lng, `검색 위치: ${query}`, true);

  const names = ["ACE PC방", "플레이존", "제로PC", "탑PC방", "피닉스", "인벤PC", "라온PC", "포텐PC"];
  const mocks = [];

  for (let i = 0; i < 8; i++) {
    const r = Math.sqrt(Math.random()) * 0.004;
    const theta = Math.random() * 2 * Math.PI;
    const cafeLat = lat + r * Math.cos(theta);
    const cafeLng = lng + r * Math.sin(theta);

    const available = Math.floor(Math.random() * 40);
    const distance = calculateDistance(lat, lng, cafeLat, cafeLng);

    // ★ 주소 요청 (Reverse Geocoding)
    const address = await getAddress(cafeLat, cafeLng);

    mocks.push({
      id: `mock-${i}`,
      name: names[i % names.length],
      lat: cafeLat,
      lng: cafeLng,
      available,
      total: 40,
      distance,
      address // ★ 추가
    });
  }

  mocks.sort((a, b) => a.distance - b.distance);

  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;

  mocks.forEach(pc => {
    // 마커 팝업에 주소까지 포함
    addMarker(
      pc.lat,
      pc.lng,
      `${pc.name}<br>${pc.address}<br>좌석 ${pc.available}/${pc.total}`
    );

    const div = document.createElement("div");
    div.className = "pcbang-card";
    div.innerHTML = `
      <h3>${pc.name}</h3>
      <p class="status">주소: ${pc.address}</p>
      <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
      <p class="status">거리: ${Math.round(pc.distance)}m</p>
      <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>
    `;
    list.appendChild(div);
  });
}

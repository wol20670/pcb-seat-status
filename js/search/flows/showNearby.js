// js/search/flows/showNearby.js
import { map } from "../../core/state.js";
import { addMarker, clearMap } from "../../map/markers.js";
import { calculateDistance, getAddress, cleanAddress } from "../../core/utils.js";

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
    const rawAddress = await getAddress(cafeLat, cafeLng);
    const address = cleanAddress(rawAddress);

    mocks.push({
      id: `mock-${i}`,
      name: names[i % names.length],
      lat: cafeLat,
      lng: cafeLng,
      available,
      total: 40,
      distance: calculateDistance(lat, lng, cafeLat, cafeLng),
      address
    });
  }

  mocks.sort((a, b) => a.distance - b.distance);

  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;

  mocks.forEach(pc => {
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
      <p class="status">남은 좌석 현황: ${pc.available} / ${pc.total}</p>
      <p class="status">거리: ${Math.round(pc.distance)}m</p>
      <button onclick="openModal('${pc.id}', '${pc.name}', ${pc.available}, ${pc.total})">
        좌석 보기
      </button>
    `;
    list.appendChild(div);
  });
}

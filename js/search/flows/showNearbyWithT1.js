// js/search/flows/showNearbyWithT1.js
import { REAL_PCBANGS, map } from "../../core/state.js";
import { addMarker, clearMap } from "../../map/markers.js";
import { calculateDistance, getAddress, cleanAddress } from "../../core/utils.js";

export async function showNearbyWithT1(lat, lng, query) {
  clearMap();
  map.setView([lat, lng], 15);

  addMarker(lat, lng, `검색 위치: ${query}`, true);

  const t1 = REAL_PCBANGS.find(p => p.name.includes("T1"));
  const t1Distance = calculateDistance(lat, lng, t1.lat, t1.lng);

  const rawT1Address = await getAddress(t1.lat, t1.lng);
  const t1Address = cleanAddress(rawT1Address);

  const names = ["ACE PC방", "플레이존", "제로PC", "탑PC방", "피닉스", "인벤PC", "라온PC", "포텐PC"];

  const allPCs = [{
    ...t1,
    distance: t1Distance,
    address: t1Address
  }];

  for (let i = 0; i < 8; i++) {
    const r = Math.sqrt(Math.random()) * 0.004;
    const theta = Math.random() * 2 * Math.PI;
    const cafeLat = lat + r * Math.cos(theta);
    const cafeLng = lng + r * Math.sin(theta);

    const available = Math.floor(Math.random() * 40);
    const rawAddress = await getAddress(cafeLat, cafeLng);
    const address = cleanAddress(rawAddress);

    allPCs.push({
      id: "mock-" + i,
      name: names[i],
      available,
      total: 40,
      lat: cafeLat,
      lng: cafeLng,
      distance: calculateDistance(lat, lng, cafeLat, cafeLng),
      address
    });
  }

  allPCs.sort((a, b) => a.distance - b.distance);

  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;

  allPCs.forEach(pc => {
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

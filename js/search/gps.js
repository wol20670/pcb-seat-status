// js/search/gps.js
import { map } from "../core/state.js";
import { clearMap, addMarker } from "../map/markers.js";
import { calculateDistance } from "../core/utils.js";

export function setGPS() {
  if (!navigator.geolocation) {
    alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      clearMap();
      map.setView([lat, lng], 15);

      addMarker(lat, lng, "현재 위치", true);

      const names = ["ACE PC방", "플레이존", "제로PC", "탑PC방", "피닉스", "인벤PC", "라온PC", "포텐PC"];
      const mockPCs = [];

      for (let i = 0; i < 8; i++) {
        const r = Math.sqrt(Math.random()) * 0.004;
        const theta = Math.random() * 2 * Math.PI;
        const cafeLat = lat + r * Math.cos(theta);
        const cafeLng = lng + r * Math.sin(theta);

        const available = Math.floor(Math.random() * 40);
        const distance = calculateDistance(lat, lng, cafeLat, cafeLng);

        mockPCs.push({
          id: "gps-" + i,
          name: names[i],
          lat: cafeLat,
          lng: cafeLng,
          available,
          total: 40,
          distance,
        });
      }

      mockPCs.sort((a, b) => a.distance - b.distance);

      const list = document.getElementById("list");
      list.innerHTML = `<h3 style="color:#374151">현재 위치 주변 PC방</h3>`;

      mockPCs.forEach(pc => {
        addMarker(pc.lat, pc.lng, `${pc.name}<br>좌석 ${pc.available}/${pc.total}`);

        const div = document.createElement("div");
        div.className = "pcbang-card";
        div.innerHTML = `
          <h3>${pc.name}</h3>
          <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
          <p class="status">거리: ${Math.round(pc.distance)}m</p>
          <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>
        `;
        list.appendChild(div);
      });
    },
    err => {
      alert("위치 정보를 가져오지 못했습니다. 브라우저 권한을 확인해주세요.");
      console.error(err);
    }
  );
}

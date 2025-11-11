let REAL_PCBANGS = [];
let map, markers = [], seatTimers = [];

async function loadPCBangData() {
  const res = await fetch("./data/pcbang.json");
  REAL_PCBANGS = await res.json();
  console.log("✅ PC방 데이터 로드 완료:", REAL_PCBANGS);
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadPCBangData();

  map = L.map("map").setView([37.5665, 126.978], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

  document.getElementById("search-btn").addEventListener("click", searchLocation);
  document.getElementById("gps-btn").addEventListener("click", setGPS);
  document.getElementById("search-input").addEventListener("keyup", e => {
    if (e.key === "Enter") searchLocation();
  });
});

function clearMap() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  document.getElementById("list").innerHTML = "";
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

async function searchLocation() {
  if (REAL_PCBANGS.length === 0) {
    alert("데이터가 아직 불러와지지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  const query = document.getElementById("search-input").value.trim();
  const type = document.querySelector('input[name="searchType"]:checked').value;
  if (!query) return alert("검색어를 입력해주세요!");

  const normalized = query.replace(/\s+/g, '').toLowerCase();
  clearMap();

  if (type === "pcbang") {
    if (normalized.includes("t1")) return showSinglePC(REAL_PCBANGS[0]);
    if (normalized.includes("원탑")) return showSinglePC(REAL_PCBANGS[1]);
    return alert("등록된 PC방 이름이 아닙니다.");
  }

  if (type === "region") {
    if (normalized.includes("을지대")) {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=을지대학교`);
      const data = await res.json();
      if (!data.length) return alert("검색 결과가 없습니다.");
      return showEuljiNearby(parseFloat(data[0].lat), parseFloat(data[0].lon), query);
    }

    if (normalized.includes("홍대")) {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!data.length) return alert("검색 결과가 없습니다.");
      return showNearbyWithT1(parseFloat(data[0].lat), parseFloat(data[0].lon), query);
    }

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data.length) return alert("검색 결과가 없습니다.");
    showNearby(parseFloat(data[0].lat), parseFloat(data[0].lon), query);
  }
}

function showSinglePC(pc) {
  clearMap();
  map.setView([pc.lat, pc.lng], 17);
  const marker = L.marker([pc.lat, pc.lng]).addTo(map)
    .bindPopup(`${pc.name}<br>좌석 ${pc.available}/${pc.total}`).openPopup();
  markers.push(marker);
  const list = document.getElementById("list");
  list.innerHTML = `
    <div class="pcbang-card">
      <h3>${pc.name}</h3>
      <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
      <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>
    </div>`;
}

function showEuljiNearby(lat, lng, query) {
  map.setView([lat, lng], 15);
  const mainMarker = L.marker([lat, lng]).addTo(map).bindPopup(`검색 위치: ${query}`).openPopup();
  markers.push(mainMarker);
  const oneTop = REAL_PCBANGS.find(p => p.name.includes("원탑PC방"));
  const dist = calculateDistance(lat, lng, oneTop.lat, oneTop.lng);
  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;
  const marker = L.marker([oneTop.lat, oneTop.lng]).addTo(map)
    .bindPopup(`${oneTop.name}<br>좌석 ${oneTop.available}/${oneTop.total}`);
  markers.push(marker);
  const div = document.createElement("div");
  div.className = "pcbang-card";
  div.innerHTML = `
    <h3>${oneTop.name}</h3>
    <p class="status">좌석 현황: ${oneTop.available} / ${oneTop.total}</p>
    <p class="status">거리: ${Math.round(dist)}m</p>
    <button onclick="openModal('${oneTop.id}', '${oneTop.name}')">좌석 보기</button>`;
  list.appendChild(div);
}

function showNearbyWithT1(lat, lng, query) {
  map.setView([lat, lng], 15);
  const userMarker = L.marker([lat, lng]).addTo(map).bindPopup(`검색 위치: ${query}`).openPopup();
  markers.push(userMarker);
  const t1 = REAL_PCBANGS.find(p => p.name.includes("T1"));
  const t1Distance = calculateDistance(lat, lng, t1.lat, t1.lng);
  const names = ["ACE PC방", "플레이존", "제로PC", "탑PC방", "피닉스", "인벤PC", "라온PC", "포텐PC"];
  const allPCs = [{ ...t1, distance: t1Distance }];
  for (let i = 0; i < 8; i++) {
    const r = Math.sqrt(Math.random()) * 0.004;
    const theta = Math.random() * 2 * Math.PI;
    const cafeLat = lat + r * Math.cos(theta);
    const cafeLng = lng + r * Math.sin(theta);
    const available = Math.floor(Math.random() * 40);
    const distance = calculateDistance(lat, lng, cafeLat, cafeLng);
    allPCs.push({ id: "mock-" + i, name: names[i], available, total: 40, lat: cafeLat, lng: cafeLng, distance });
  }
  allPCs.sort((a, b) => a.distance - b.distance);
  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;
  allPCs.forEach(pc => {
    const marker = L.marker([pc.lat, pc.lng]).addTo(map)
      .bindPopup(`${pc.name}<br>좌석 ${pc.available}/${pc.total}`);
    markers.push(marker);
    const div = document.createElement("div");
    div.className = "pcbang-card";
    div.innerHTML = `
      <h3>${pc.name}</h3>
      <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
      <p class="status">거리: ${Math.round(pc.distance)}m</p>
      <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>`;
    list.appendChild(div);
  });
}

function showNearby(lat, lng, query) {
  map.setView([lat, lng], 15);
  const mainMarker = L.marker([lat, lng]).addTo(map).bindPopup(`검색 위치: ${query}`).openPopup();
  markers.push(mainMarker);
  const names = ["ACE PC방", "플레이존", "제로PC", "탑PC방", "피닉스", "인벤PC", "라온PC", "포텐PC"];
  const mocks = [];
  for (let i = 0; i < 8; i++) {
    const r = Math.sqrt(Math.random()) * 0.004;
    const theta = Math.random() * 2 * Math.PI;
    const cafeLat = lat + r * Math.cos(theta);
    const cafeLng = lng + r * Math.sin(theta);
    const available = Math.floor(Math.random() * 40);
    const distance = calculateDistance(lat, lng, cafeLat, cafeLng);
    mocks.push({
      id: `mock-${i}`,
      name: names[i % names.length],
      lat: cafeLat,
      lng: cafeLng,
      available,
      total: 40,
      distance
    });
  }
  mocks.sort((a, b) => a.distance - b.distance);
  const list = document.getElementById("list");
  list.innerHTML = `<h3>${query} 주변 PC방</h3>`;
  mocks.forEach(pc => {
    const marker = L.marker([pc.lat, pc.lng]).addTo(map)
      .bindPopup(`${pc.name}<br>좌석 ${pc.available}/${pc.total}`);
    markers.push(marker);
    const div = document.createElement("div");
    div.className = "pcbang-card";
    div.innerHTML = `
      <h3>${pc.name}</h3>
      <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
      <p class="status">거리: ${Math.round(pc.distance)}m</p>
      <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>`;
    list.appendChild(div);
  });
}

/* ✅ 수정된 GPS 기능 - 주변 모의 PC방 자동 생성 */
function setGPS() {
  if (!navigator.geolocation) {
    alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      clearMap();
      map.setView([lat, lng], 15);
      const marker = L.marker([lat, lng]).addTo(map)
        .bindPopup("현재 위치").openPopup();
      markers.push(marker);

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
          distance
        });
      }

      mockPCs.sort((a, b) => a.distance - b.distance);

      const list = document.getElementById("list");
      list.innerHTML = `<h3 style="color:#374151">현재 위치 주변 PC방</h3>`;
      mockPCs.forEach(pc => {
        const marker = L.marker([pc.lat, pc.lng]).addTo(map)
          .bindPopup(`${pc.name}<br>좌석 ${pc.available}/${pc.total}`);
        markers.push(marker);
        const div = document.createElement("div");
        div.className = "pcbang-card";
        div.innerHTML = `
          <h3>${pc.name}</h3>
          <p class="status">좌석 현황: ${pc.available} / ${pc.total}</p>
          <p class="status">거리: ${Math.round(pc.distance)}m</p>
          <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>`;
        list.appendChild(div);
      });
    },
    (err) => {
      alert("위치 정보를 가져오지 못했습니다. 브라우저 권한을 확인해주세요.");
      console.error(err);
    }
  );
}

function openModal(id, name) {
  const modal = document.getElementById("seatModal");
  const grid = document.getElementById("seatGrid");
  const seatInfo = document.getElementById("seatInfo");
  document.getElementById("seatTitle").textContent = `${name} 좌석 현황`;
  grid.innerHTML = "";
  seatInfo.textContent = "좌석을 클릭하면 남은 시간이 표시됩니다.";
  modal.style.display = "flex";
  const statuses = ["available", "using", "reserved"];
  if (!seatTimers[id]) seatTimers[id] = {};
  for (let i = 1; i <= 40; i++) {
    const div = document.createElement("div");
    let status = statuses[Math.floor(Math.random()*statuses.length)];
    div.className = `seat ${status}`;
    div.textContent = i;
    if (!seatTimers[id][i]) {
      seatTimers[id][i] = status === "using" ? Math.floor(Math.random()*90)+30 :
        status === "reserved" ? Math.floor(Math.random()*20)+5 : 0;
    }
    div.addEventListener("click", () => {
      const remain = seatTimers[id][i];
      seatInfo.textContent = remain <= 0 ?
        `${i}번 자리는 현재 비어 있습니다.` :
        `${i}번 자리는 사용 중입니다. 남은 시간 약 ${remain}분.`;
    });
    grid.appendChild(div);
  }
}

function closeModal() {
  document.getElementById("seatModal").style.display = "none";
}

export function renderSinglePC(pc) {
  const list = document.getElementById("list");
  list.innerHTML = `
    <div class="pcbang-card">
      <h3>${pc.name}</h3>
      <p class="status">남은 좌석 현황: ${pc.available} / ${pc.total}</p>
      <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>
    </div>
  `;
}

export function renderList(title, pcs) {
  const list = document.getElementById("list");
  list.innerHTML = `<h3>${title}</h3>`;

  pcs.forEach(pc => {
    list.innerHTML += `
      <div class="pcbang-card">
        <h3>${pc.name}</h3>
        <p class="status">좌석 ${pc.available} / ${pc.total}</p>
        <p class="status">거리: ${Math.round(pc.distance)}m</p>
        <button onclick="openModal('${pc.id}', '${pc.name}')">좌석 보기</button>
      </div>
    `;
  });
}

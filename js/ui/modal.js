// js/ui/modal.js
import { seatTimers } from "../core/state.js";

export function openModal(id, name) {
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
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    div.className = `seat ${status}`;
    div.textContent = i;

    if (!seatTimers[id][i]) {
      seatTimers[id][i] =
        status === "using"
          ? Math.floor(Math.random() * 90) + 30
          : status === "reserved"
          ? Math.floor(Math.random() * 20) + 5
          : 0;
    }

    div.addEventListener("click", () => {
      const remain = seatTimers[id][i];
      seatInfo.textContent =
        remain <= 0
          ? `${i}번 자리는 현재 비어 있습니다.`
          : `${i}번 자리는 사용 중입니다. 남은 시간 약 ${remain}분.`;
    });

    grid.appendChild(div);
  }
}

export function closeModal() {
  document.getElementById("seatModal").style.display = "none";
}

window.openModal = openModal;
window.closeModal = closeModal;

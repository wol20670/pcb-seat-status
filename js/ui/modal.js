// js/ui/modal.js
import { seatTimers } from "../core/state.js";

export function openModal(id, name, availableCount = 0, totalCount = 40) {
  const modal = document.getElementById("seatModal");
  const grid = document.getElementById("seatGrid");
  const seatInfo = document.getElementById("seatInfo");

  document.getElementById("seatTitle").textContent = `${name} 좌석 현황`;
  grid.innerHTML = "";
  seatInfo.textContent = "좌석을 클릭하면 남은 시간이 표시됩니다.";

  modal.style.display = "flex";

  // 좌석 상태 배열 생성
  const seats = [];

  // availableCount 만큼 available
  for (let i = 0; i < availableCount; i++) seats.push("available");

  // 나머지 좌석은 using / reserved 랜덤 분배
  const remain = totalCount - availableCount;
  for (let i = 0; i < remain; i++) {
    seats.push(Math.random() > 0.5 ? "using" : "reserved");
  }

  // 랜덤 섞기
  seats.sort(() => Math.random() - 0.5);

  if (!seatTimers[id]) seatTimers[id] = {};

  for (let i = 1; i <= totalCount; i++) {
    // 줄 바꿈 처리
    if (i === 11 || i === 21 || i === 31) {
      const rowBreak = document.createElement("div");
      rowBreak.className = "seat-row-break";
      grid.appendChild(rowBreak);
    }

    const div = document.createElement("div");
    const status = seats[i - 1];

    div.className = `seat ${status}`;
    div.textContent = i;

    // 남은 시간 설정
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

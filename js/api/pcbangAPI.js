// js/api/pcbangAPI.js
import { setPCBangData } from "../core/state.js";

export async function loadPCBangData() {
  const res = await fetch("./data/pcbang.json");
  const json = await res.json();
  setPCBangData(json);
  console.log("✅ PC방 데이터 로드 완료:", json);
}

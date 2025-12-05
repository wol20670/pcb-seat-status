import { REAL_PCBANGS } from "../api/pcbangAPI.js";
import { renderSinglePC } from "../ui/listRenderer.js";
import { clearMarkers, addMarker } from "../map/markers.js";
import { map } from "../map/mapInit.js";

export function searchByPCBang(query) {
  const normalized = query.replace(/\s+/g, "").toLowerCase();

  clearMarkers();

  if (normalized.includes("t1")) {
    const pc = REAL_PCBANGS[0];
    map.setView([pc.lat, pc.lng], 17);
    addMarker(pc.lat, pc.lng, `${pc.name}<br>좌석 ${pc.available}/${pc.total}`).openPopup();
    renderSinglePC(pc);
    return;
  }

  if (normalized.includes("원탑")) {
    const pc = REAL_PCBANGS[1];
    map.setView([pc.lat, pc.lng], 17);
    addMarker(pc.lat, pc.lng, `${pc.name}<br>좌석 ${pc.available}/${pc.total}`);
    renderSinglePC(pc);
    return;
  }

  alert("등록된 PC방 이름이 아닙니다.");
}

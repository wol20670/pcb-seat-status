// js/search/searchController.js
import { REAL_PCBANGS } from "../core/state.js";
import { clearMap } from "../map/markers.js";
import { showSinglePC } from "./flows/showSinglePC.js";
import { showEuljiNearby } from "./flows/showEuljiNearby.js";
import { showNearbyWithT1 } from "./flows/showNearbyWithT1.js";
import { showNearby } from "./flows/showNearby.js";

export async function handleSearch() {
  if (REAL_PCBANGS.length === 0) {
    alert("데이터가 아직 불러와지지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  const query = document.getElementById("search-input").value.trim();
  const type = document.querySelector('input[name="searchType"]:checked').value;

  if (!query) return alert("검색어를 입력해주세요!");

  const normalized = query.replace(/\s+/g, "").toLowerCase();

  clearMap();

  if (type === "pcbang") {
    if (normalized.includes("t1")) return showSinglePC(REAL_PCBANGS[0]);
    if (normalized.includes("원탑")) return showSinglePC(REAL_PCBANGS[1]);
    return alert("등록된 PC방 이름이 아닙니다.");
  }

  if (type === "region") {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.length) return alert("검색 결과가 없습니다.");

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    if (normalized.includes("을지대")) return showEuljiNearby(lat, lng, query);
    if (normalized.includes("홍대")) return showNearbyWithT1(lat, lng, query);

    return showNearby(lat, lng, query);
  }
}

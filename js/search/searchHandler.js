import { searchByPCBang } from "./searchPcbang.js";
import { searchByRegion } from "./searchRegion.js";

export function handleSearch() {
  const query = document.getElementById("search-input").value.trim();
  const type = document.querySelector('input[name="searchType"]:checked').value;

  if (!query) return alert("검색어를 입력하세요!");

  if (type === "pcbang") return searchByPCBang(query);
  return searchByRegion(query);
}

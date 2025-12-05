import { loadPCBangData } from "./api/pcbangAPI.js";
import { initMap } from "./map/mapInit.js";
import { handleSearch } from "./search/searchHandler.js";
import { setGPS } from "./search/gpsSearch.js";

window.addEventListener("DOMContentLoaded", async () => {
  await loadPCBangData();
  initMap();

  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document.getElementById("gps-btn").addEventListener("click", setGPS);

  document.getElementById("search-input").addEventListener("keyup", e => {
    if (e.key === "Enter") handleSearch();
  });
});

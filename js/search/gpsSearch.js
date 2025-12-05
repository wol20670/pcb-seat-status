import { calculateDistance } from "../map/distance.js";
import { addMarker, clearMarkers } from "../map/markers.js";
import { renderList } from "../ui/listRenderer.js";
import { map } from "../map/mapInit.js";

export function setGPS() {
  if (!navigator.geolocation) {
    alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      clearMarkers();
      map.setView([lat, lng], 15);

      addMarker(lat, lng, "현재 위치").openPopup();

      const names = ["ACE PC방", "플레이존", "제로PC", "탑PC방", "피닉스", "인벤PC", "라온PC", "포텐PC"];

      const mockPCs = names.map((name, i) => {
        const r = Math.sqrt(Math.random()) * 0.004;
        const theta = Math.random() * 2 * Math.PI;
        const cafeLat = lat + r * Math.cos(theta);
        const cafeLng = lng + r * Math.sin(theta);
        const available = Math.floor(Math.random() * 40);
        return {
          id: "gps-" + i,
          name,
          lat: cafeLat,
          lng: cafeLng,
          available,
          total: 40,
          distance: calculateDistance(lat, lng, cafeLat, cafeLng),
        };
      }).sort((a, b) => a.distance - b.distance);

      renderList("현재 위치 주변 PC방", mockPCs);
    },

    (err) => {
      alert("위치 정보를 가져오지 못했습니다. 브라우저 권한을 확인해주세요.");
    }
  );
}

// js/core/utils.js
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

export async function getAddress(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.display_name || "주소 정보를 불러올 수 없습니다.";
}

export function cleanAddress(raw) {
  if (!raw) return "주소 정보를 불러올 수 없습니다.";

  // 콤마로 분리
  const parts = raw.split(",").map(p => p.trim());

  // 가장 많이 쓰는 형태: 번호 + 도로명 + 구 + 시
  // 예: "35, 잔다리로6길, 서교동, 마포구, 서울특별시, 04042, 대한민국"
  // → "서울특별시 마포구 서교동 잔다리로6길 35"

  let number = parts[0];           // "35"
  let road = parts[1];             // "잔다리로6길"
  let dong = parts[2];             // "서교동"
  let district = parts[3];         // "마포구"
  let city = parts[4];             // "서울특별시"

  return `${city} ${district} ${dong} ${road} ${number}`;
}

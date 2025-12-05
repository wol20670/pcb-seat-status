export let REAL_PCBANGS = [];

export async function loadPCBangData() {
  const res = await fetch("./data/pcbang.json");
  REAL_PCBANGS = await res.json();
  console.log("PC방 데이터 로드 완료:", REAL_PCBANGS);
}

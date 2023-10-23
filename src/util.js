/* eslint-disable no-loss-of-precision */
const { PI } = Math;
// 球体长半径
const SPHERE_RADIUS = 6378245.0;
// 扁率
const FLATNESS = 0.00669342162296594323;
// const ER = 20037508.342789;

function transformLat(inputLng, inputLat) {
  const lat = +inputLat;
  const lng = +inputLng;
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
}

function transformLng(inputLng, inputLat) {
  const lat = +inputLat;
  const lng = +inputLng;
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function outOfChina(inputLng, inputLat) {
  const lat = +inputLat;
  const lng = +inputLng;
  // 纬度 3.86~53.55, 经度 73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

/**
 * wgs84 转 gcj02
 * 离线转换
 * @param inputLng
 * @param inputLat
 * @returns {number[]}
 */
export function wgs84ToGcj02(inputLng, inputLat) {
  const lat = +inputLat;
  const lng = +inputLng;
  if (outOfChina(lng, lat)) {
    return [lng, lat];
  } else {
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - FLATNESS * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat =
      (dLat * 180.0) /
      (((SPHERE_RADIUS * (1 - FLATNESS)) / (magic * sqrtMagic)) * PI);
    dLng =
      (dLng * 180.0) / ((SPHERE_RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
    const mgLat = lat + dLat;
    const mgLng = lng + dLng;
    return [mgLng, mgLat];
  }
}

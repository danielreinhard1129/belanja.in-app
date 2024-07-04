export const getDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
) => {
  var roe = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLong = deg2rad(long2 - long1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = roe * c;
  return d;
};
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

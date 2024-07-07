export const getDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
) => {
  const earthRadius = 6371;

  const dLat = deg2rad(lat2 - lat1);
  const dLong = deg2rad(long2 - long1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
};

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

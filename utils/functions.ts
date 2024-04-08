export const calculateDeltas = (aspectRatio: number, longitude: number) => {
  let zoom = 12;
  const latDelta = (360 * zoom) / (aspectRatio * Math.pow(2, zoom));
  const lonDelta = latDelta / Math.cos(longitude * (Math.PI / 180));
  return { latitudeDelta: latDelta, longitudeDelta: lonDelta };
};

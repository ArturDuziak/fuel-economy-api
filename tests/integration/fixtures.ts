export const getRandomTrip = () => {
  return {
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
    travelTime: Math.floor(Math.random() * 100) + 1,
    distance: Math.floor(Math.random() * 100) + 1,
    avgSpeed: Math.floor(Math.random() * 100) + 1,
    fuelConsumption: Number((Math.random() * 10 + 1).toFixed(1)),
    startCoordinates: {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    },
    endCoordinates: {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    },
  };
};

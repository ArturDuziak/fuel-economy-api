export type Trip = {
  id: string;
  startDate: string;
  endDate: string;
  travelTime: number; // in minutes
  distance: number; // in km
  avgSpeed: number; // in km/h
  fuelConsumption: string; // in liters per 100km
  startCoordinates: {
    lat: number;
    lng: number;
  };
  endCoordinates: {
    lat: number;
    lng: number;
  };
};

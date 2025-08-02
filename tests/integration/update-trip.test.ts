import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { getRandomTrip } from './fixtures';
import { randomUUID } from 'node:crypto';

describe('Update trip', () => {
  it('should update a trip', async () => {
    const trip = getRandomTrip();
    const userId = randomUUID();

    // TODO: Create this in DB or create a helper
    const response = await request('http://localhost:3000').post(`/v1/trips/${userId}/add`).send(trip);

    expect(response.status).toBe(201);

    const tripId = response.body.id;

    const updatedTrip = {
      ...trip,
      fuelConsumption: trip.fuelConsumption + 1,
      travelTime: trip.travelTime + 1,
    };

    const updateResponse = await request('http://localhost:3000').put(`/v1/trips/${userId}/${tripId}`).send(updatedTrip);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toMatchObject(updatedTrip);
  });

  it('should return not found error if trip is not found', async () => {
    const userId = randomUUID();
    const tripId = randomUUID();

    const response = await request('http://localhost:3000').put(`/v1/trips/${userId}/${tripId}`).send(getRandomTrip());

    expect(response.status).toBe(404);
  });

  it('should not allow to update invalid trip id', async () => {
    const userId = randomUUID();
    const tripId = '12345';

    const response = await request('http://localhost:3000').put(`/v1/trips/${userId}/${tripId}`).send(getRandomTrip());

    expect(response.status).toBe(400);
  });
});

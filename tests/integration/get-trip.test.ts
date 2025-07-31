import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { getRandomTrip } from './fixtures';
import { randomUUID } from 'node:crypto';

describe('Get trip', () => {
  it('should get a trip', async () => {
    const trip = getRandomTrip();
    const userId = randomUUID();

    // TODO: Create this in DB or create a helper
    const response = await request('http://localhost:3000').post(`/v1/trips/${userId}/add`).send(trip);

    expect(response.status).toBe(201);

    const tripId = response.body.id;

    const getResponse = await request('http://localhost:3000').get(`/v1/trips/${userId}/${tripId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(trip);
  });

  it('should return not found error if trip is not found', async () => {
    const userId = randomUUID();
    const tripId = randomUUID();

    const getResponse = await request('http://localhost:3000').get(`/v1/trips/${userId}/${tripId}`);

    expect(getResponse.status).toBe(404);
  });

  it('should not allow to fetch invalid trip id', async () => {
    const userId = randomUUID();
    const tripId = '12345';

    const getResponse = await request('http://localhost:3000').get(`/v1/trips/${userId}/${tripId}`);

    expect(getResponse.status).toBe(400);
  });
});

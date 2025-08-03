import { describe, it, expect, inject } from 'vitest';
import request from 'supertest';
import { getRandomTrip } from './fixtures';
import { randomUUID } from 'node:crypto';

const serverUrl = inject('serverUrl');
const api = request(serverUrl);

describe('Get trip', () => {
  it('should get a trip', async () => {
    const trip = getRandomTrip();
    const userId = randomUUID();

    // TODO: Create this in DB or create a helper
    const response = await api.post(`/v1/${userId}/trips`).send(trip);

    expect(response.status).toBe(201);

    const tripId = response.body.id;

    const getResponse = await api.get(`/v1/${userId}/trips/${tripId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(trip);
  });

  it('should return not found error if trip is not found', async () => {
    const userId = randomUUID();
    const tripId = randomUUID();

    const response = await api.get(`/v1/${userId}/trips/${tripId}`);

    expect(response.status).toBe(404);
  });

  it('should not allow to fetch invalid trip id', async () => {
    const userId = randomUUID();
    const tripId = '12345';

    const response = await api.get(`/v1/${userId}/trips/${tripId}`);

    expect(response.status).toBe(400);
  });
});

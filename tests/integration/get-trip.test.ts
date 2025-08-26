import { describe, it, expect, beforeEach } from 'vitest';
import { getRandomTrip } from './fixtures';
import { randomUUID } from 'node:crypto';
import { createAuthenticatedTestUser } from './helpers';

describe('Get trip', () => {
  let api: any;

  beforeEach(async () => {
    const { authenticatedAgent } = await createAuthenticatedTestUser();
    api = authenticatedAgent;
  });

  it('should get a trip', async () => {
    const trip = getRandomTrip();

    // TODO: Create this in DB or create a helper
    const response = await api.post(`/v1/trips`).send(trip);

    expect(response.status).toBe(201);

    const tripId = response.body.id;

    const getResponse = await api.get(`/v1/trips/${tripId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(trip);
  });

  it('should return not found error if trip is not found', async () => {
    const tripId = randomUUID();

    const response = await api.get(`/v1/trips/${tripId}`);

    expect(response.status).toBe(404);
  });

  it('should not allow to fetch invalid trip id', async () => {
    const tripId = '12345';

    const response = await api.get(`/v1/trips/${tripId}`);

    expect(response.status).toBe(400);
  });
});

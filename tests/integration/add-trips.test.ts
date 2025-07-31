import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { getRandomTrip } from './fixtures';

describe('Add trips', () => {
  it('should add a trip', async () => {
    const trip = getRandomTrip();

    const response = await request('http://localhost:3000').post('/v1/trips/00000000-0000-0000-0000-000000000000/add').send(trip);

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      ...trip,
    });
  });

  it('should transform valid number string to number', async () => {
    const trip = getRandomTrip();

    const response = await request('http://localhost:3000')
      .post('/v1/trips/00000000-0000-0000-0000-000000000000/add')
      .send({
        ...trip,
        fuelConsumption: '5.5',
        distance: '100',
        travelTime: '60.4',
      });

    expect(response.status).toBe(201);

    expect(response.body.distance).toBe(100.0);
    expect(response.body.fuelConsumption).toBe(5.5);
    expect(response.body.travelTime).toBe(60);
  });

  it('should not add a trip with fuel consumption passed as string', async () => {
    const trip = getRandomTrip();

    const response = await request('http://localhost:3000')
      .post('/v1/trips/00000000-0000-0000-0000-000000000000/add')
      .send({
        ...trip,
        fuelConsumption: '5.5abc',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('body/fuelConsumption must be number');
  });

  it('should not add a trip with too high fuel consumption', async () => {
    const trip = getRandomTrip();

    const response = await request('http://localhost:3000')
      .post('/v1/trips/00000000-0000-0000-0000-000000000000/add')
      .send({
        ...trip,
        fuelConsumption: 111.1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('body/fuelConsumption must be <= 100');
  });

  it('should not add a trip with negative fuel consumption', async () => {
    const trip = getRandomTrip();

    const response = await request('http://localhost:3000')
      .post('/v1/trips/00000000-0000-0000-0000-000000000000/add')
      .send({
        ...trip,
        fuelConsumption: -1.1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('body/fuelConsumption must be >= 0');
  });
});

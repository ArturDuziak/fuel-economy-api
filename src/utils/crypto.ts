import { randomBytes, scryptSync } from 'node:crypto';

export function hashPassword(plainTextPassword: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(plainTextPassword, salt, 64).toString('hex');

  return `${salt}:${derivedKey}`;
}

export function isPasswordValid(plainTextPassword: string, hashedPassword: string): boolean {
  const [salt, derivedKey] = hashedPassword.split(':');

  if (!salt || !derivedKey) {
    return false;
  }

  const derivedKeyToCompare = scryptSync(plainTextPassword, salt, 64).toString('hex');

  return derivedKey === derivedKeyToCompare;
}

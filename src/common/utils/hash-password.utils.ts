import { pbkdf2Sync } from 'crypto';
/**
 * Generate hash password
 * @param password
 * @param salt
 * @returns string
 */
export function generateHashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString(`hex`);
}

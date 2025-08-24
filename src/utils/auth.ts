import * as bcrypt from 'bcrypt';

export async function getPasswordHash(password: string) {
  const salt = process.env.BCRYPT_SALT_ROUNDS ?? 10;
  return bcrypt.hash(password, salt);
}

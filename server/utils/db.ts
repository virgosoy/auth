import { randomUUID } from 'uncrypto';
// @ts-ignore: js 是正常的，ts 不正常，相关见：https://nitro.unjs.io/guide/auto-imports#manual-imports
import { useStorage as _useStorage } from '#imports';
import type { Storage, StorageValue } from 'unstorage'

/** 重写 useStorage 给予默认 key */
const useStorage = <T extends StorageValue>(): Storage<T> => _useStorage<T>('.data:auth')

export interface User {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  password: string;
}

export async function findUserByEmail(email: string): Promise<User> {
  const storage = useStorage();
  const key = getUserKey(email!);
  return await storage.getItem(key);
}

export async function createUser(user: Partial<User>) {
  const storage = useStorage();
  const key = getUserKey(user.email!);
  if (await storage.hasItem(key)) {
    throw createError({ message: "Email already exists!", statusCode: 409 })
  }
  return await storage.setItem(key, {
      id: randomUUID(),
      ...user,
  });
}

export async function updateUserByEmail(email: string, updates: Partial<User>) {
  const storage = useStorage();
  const user = await findUserByEmail(email);
  const key = getUserKey(user.email!);
  return await storage.setItem(key, {
      ...user,
      ...updates,
  });
}

function getUserKey(email: string) {
  return `db:auth:users:${encodeURIComponent(email)}`;
}

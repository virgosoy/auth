import { randomUUID } from 'uncrypto';
// @ts-ignore: js 是正常的，ts 不正常，相关见：https://nitro.unjs.io/guide/auto-imports#manual-imports
// import { useStorage as _useStorage } from '#imports';
import type { Storage, StorageValue } from 'unstorage'

/** 重写 useStorage 给予默认 key */
// const useStorage = <T extends StorageValue>(): Storage<T> => _useStorage<T>('auth')

/**
 * 用户
 */
export interface User {
  id: string;
  createdAt: string;
  name: string;
  account: string;
  /**
   * 加密后的，用 await hash(password) 加密
   */
  password: string;
}

/**
 * key 前缀
 */
const KEY_PREFIX = 'auth:users:'

/**
 * 列出所有账号
 */
export async function listAccount() {
  const storage = useStorage()
  const keys = await storage.getKeys(KEY_PREFIX);
  const items = await storage.getItems(keys)
  const accounts = items.map(item => item.value as User)
  return accounts
}

/**
 * 根据账号查找用户
 * @param account 
 */
export async function findUserByAccount(account: string): Promise<User | null> {
  const storage = useStorage();
  const key = getUserKey(account!);
  return await storage.getItem(key);
}

/**
 * 创建用户
 * @param user.password 是经过 hash 的，可以使用 await hash(password) 生成 
 */
export async function createUser(user: Partial<User>) {
  const storage = useStorage();
  const key = getUserKey(user.account!);
  if (await storage.hasItem(key)) {
    throw createError({ message: "Account already exists!", statusCode: 409 })
  }
  return await storage.setItem(key, {
      id: randomUUID(),
      ...user,
  });
}

/**
 * 根据账号更新用户
 * @param account 
 * @param updates 更新的数据
 * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
 */
export async function updateUserByAccount(account: string, updates: Partial<User>) {
  const storage = useStorage();
  const user = await findUserByAccount(account);
  if (!user) {
    throw createError({ message: 'User not found!', statusCode: 404 });
  }
  const key = getUserKey(user.account!);
  return await storage.setItem(key, {
      ...user,
      ...updates,
  });
}

function getUserKey(account: string) {
  return `${KEY_PREFIX}${encodeURIComponent(account)}`;
}

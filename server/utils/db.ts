
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

interface UserDb {
  /**
   * 列出所有账号
   */
  listUser(): Promise<User[]>
  /**
   * 根据账号查找用户
   * @param account 
   */
  findUserByAccount(account: string): Promise<User | null>
  /**
   * 创建用户
   * @param user.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  createUser(user: Partial<User>): Promise<void>
  /**
   * 根据账号更新用户
   * @param account 
   * @param updates 更新的数据
   * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  updateUserByAccount(account: string, updates: Partial<User>): Promise<void>
  /**
   * 根据 id 更新用户
   * @param updates 
   * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  updateUserById(updates: Partial<User>): Promise<void>
}

const userDbWrapper = new Proxy({} as UserDb, {
  get(target, p, receiver) {
    // @ts-ignore
    return (...args) => userDb[p](...args)
  },
})

let userDb: UserDb

export function defineUserDb(userDb_: UserDb){
  userDb = userDb_
}

export const { listUser, findUserByAccount, createUser, updateUserByAccount, updateUserById } = userDbWrapper



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

interface UserDb<
  UserT extends Record<string, any> = Record<string, any>, 
  UserForFrontEndT extends Record<string, any> = Record<string, any>
> {
  /**
   * 列出所有账号
   */
  listUser(): Promise<UserT[]>
  /**
   * 根据账号查找用户
   * @param account 
   */
  findUserByAccount(account: string): Promise<UserT | null>
  /**
   * 创建用户
   * @param user.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  createUser(user: Partial<UserT>): Promise<void>
  /**
   * 根据账号更新用户
   * @param account 
   * @param updates 更新的数据
   * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  updateUserByAccount(account: string, updates: Partial<UserT>): Promise<void>
  /**
   * 根据 id 更新用户
   * @param updates 
   * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  updateUserById(updates: Partial<UserT>): Promise<void>

  /**
   * 给前端展示的用户，去除敏感信息，如密码
   * @param user -
   */
  userForFrontEnd(user: UserT): UserForFrontEndT
}

let userDb: UserDb

export function defineUserDb<
  UserT extends Record<string, any> = Record<string, any>, 
  UserForFrontEndT extends Record<string, any> = Record<string, any>
>(userDb_: UserDb<UserT, UserForFrontEndT>){
  userDb = userDb_
}

/**
 * 使用 UserDb \
 * 必须先使用 {@link defineUserDb} 设置 userDb 后才可以使用。
 */
export function useUserDb(){
  return userDb
}
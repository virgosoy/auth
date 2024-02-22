
// @ts-ignore: js 是正常的，ts 不正常，相关见：https://nitro.unjs.io/guide/auto-imports#manual-imports
// import { useStorage as _useStorage } from '#imports';
import type { Storage, StorageValue } from 'unstorage'
import type { BaseUserIdentity } from './auth-core';

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
 * 用户身份证明（凭证），密码
 */
export type BaseUserCredential = {}

/**
 * 用户账号
 * 和 {@link BaseUserIdentity} 类似，但不一定一致，前者方便用户输入，后者可以存储账号，也可以存储整个对象，都是可以确定用户的唯一。
 */
export type BaseUserAccount = {}

interface UserDb<
  UserT extends Record<string, any> = Record<string, any>, 
  UserForFrontEndT extends Record<string, any> = Record<string, any>,
  UserAccountT extends BaseUserAccount = BaseUserAccount,
  UserIdentityT extends BaseUserIdentity = BaseUserIdentity,
  UserCredentialT extends BaseUserCredential = BaseUserCredential,
> {
  /**
   * 列出所有账号
   */
  listUser(): Promise<UserT[]>
  /**
   * 根据账号查找用户
   * @param account 
   */
  findUserByAccount(account: UserAccountT): Promise<UserT | null>
  /**
   * 创建用户
   * @param user.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  createUser(user: Partial<UserT>): Promise<void>
  // /**
  //  * 根据账号更新用户
  //  * @param identity 
  //  * @param updates 更新的数据
  //  * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
  //  */
  // updateUserByIdentity(identity: UserIdentityT, updates: Partial<UserT>): Promise<void>
  /**
   * 根据 id 更新用户
   * @param updates 
   * @param updates.password 是经过 hash 的，可以使用 await hash(password) 生成 
   */
  updateUserById(updates: Partial<UserT>): Promise<void>

  /**
   * 修改用户证明（密码）
   * @param identity -
   * @param oldCredential -
   * @param newCredential -
   */
  changeUserCredential(identity: UserIdentityT, oldCredential: UserCredentialT, newCredential: UserCredentialT): Promise<void>

  /**
   * 给前端展示的用户，去除敏感信息，如密码
   * @param user -
   */
  userForFrontEnd(user: UserT): UserForFrontEndT
}

let userDb: UserDb

export function defineUserDb<
  UserT extends Record<string, any> = Record<string, any>, 
  UserForFrontEndT extends Record<string, any> = Record<string, any>,
  UserIdentityT extends BaseUserIdentity = BaseUserIdentity,
  UserCredentialT extends BaseUserCredential = BaseUserCredential,
>(userDb_: UserDb<UserT, UserForFrontEndT, UserIdentityT, UserCredentialT>){
  userDb = userDb_
}

/**
 * 使用 UserDb \
 * 必须先使用 {@link defineUserDb} 设置 userDb 后才可以使用。
 */
export function useUserDb(){
  return userDb
}
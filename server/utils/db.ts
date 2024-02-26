
// @ts-ignore: js 是正常的，ts 不正常，相关见：https://nitro.unjs.io/guide/auto-imports#manual-imports
// import { useStorage as _useStorage } from '#imports';
import type { Storage, StorageValue } from 'unstorage'

/** 重写 useStorage 给予默认 key */
// const useStorage = <T extends StorageValue>(): Storage<T> => _useStorage<T>('auth')


/**
 * 基类，用户对象
 */
export type BaseUser = Record<string, any>

/**
 * 基类，用户对象，用于前端显示
 */
export type BaseUserForFrontEnd = Record<string, any>

/**
 * 用户账号
 * 和 {@link BaseUserIdentity} 类似，但不一定一致，前者方便用户输入，后者可以存储账号，也可以存储整个对象，都是可以确定用户的唯一。
 */
export type BaseUserAccount = {}


interface UserDb<
  UserT extends BaseUser = BaseUser, 
  UserForFrontEndT extends BaseUserForFrontEnd = BaseUserForFrontEnd,
  UserAccountT extends BaseUserAccount = BaseUserAccount,
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
   * @param user 密码是否加密取决于实现，user 与前端请求后端接收的参数一致。 \
   * 可以在前端加密后传输，也可以在后端加密。甚至双端都加密。 \
   * 如需加密可以使用 await hash(password) 生成 
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
   * 更新用户，以什么做主键取决于实现，但一般建议 id 做主键。
   * @param updates 用户对象，密码是否经过加密取决于实现。\
   * 此对象与前端请求后端参数一致。 \
   * 如需加密，可以使用 await hash(password) 生成 \
   * 实现注意：即使对象值是 undefined，也会被对象扩展覆盖，所以要注意密码的传递。
   */
  updateUser(updates: Partial<UserT>): Promise<void>
  /**
   * 给前端展示的用户，去除敏感信息，如密码
   * @param user -
   */
  userForFrontEnd(user: UserT): UserForFrontEndT
}

let userDb: UserDb

/**
 * 定义 user 数据库操作 \
 * 方便类型定义，并方便其他方法调用参数中的方法。
 * @param userDb_ -
 * @returns 会直接返回参数，方便外部使用，外部可直接使用这些函数。
 */
export function defineUserDb<
  UserT extends BaseUser = BaseUser, 
  UserForFrontEndT extends BaseUserForFrontEnd = BaseUserForFrontEnd,
  UserAccountT extends BaseUserAccount = BaseUserAccount,
>(userDb_: UserDb<UserT, UserForFrontEndT, UserAccountT>){
  userDb = userDb_
  return userDb_
}

/**
 * 使用 UserDb \
 * 必须先使用 {@link defineUserDb} 设置 userDb 后才可以使用。
 */
export function useUserDb(){
  return userDb
}
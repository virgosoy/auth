// 数据转换工具类，业务相关

import type { User } from "./db"

export function userForFrontEnd(user: User): Omit<User, 'password'>
export function userForFrontEnd(user: undefined | null): undefined
export function userForFrontEnd(user: User | undefined | null): Omit<User, 'password'> | undefined
/**
 * 给前端展示的用户，即去除密码字段
 * @param user -
 */
export function userForFrontEnd(user: User | undefined | null){
  if(user){
    const { password, ...result } = user
    return result as Omit<User, 'password'>
  }
  return undefined
}
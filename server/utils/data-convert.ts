// 数据转换工具类，业务相关

import type { User } from "./db"

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
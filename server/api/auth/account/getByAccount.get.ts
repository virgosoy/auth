import type { User } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  // 查询参数
  const query = getQuery<{ account: string }>(event)
  const account = query.account
  
  const user = await findUserByAccount(account)
  if(user){
    const { password, ...newUser} = user
    return newUser as Omit<User, 'password'>
  }
  return undefined
})
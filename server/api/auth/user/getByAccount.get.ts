import { userForFrontEnd } from "../../../utils/data-convert"
import type { User } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  // 查询参数
  const query = getQuery<{ account: string }>(event)
  const account = query.account
  
  const user = await findUserByAccount(account)
  return userForFrontEnd(user)
})
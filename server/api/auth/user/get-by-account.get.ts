import { useUserDb } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  // 查询参数
  const query = getQuery<{ account: string }>(event)
  const account = query.account
  const { findUserByAccount, userForFrontEnd } = useUserDb()
  const user = await findUserByAccount(account)
  return user && userForFrontEnd(user)
})
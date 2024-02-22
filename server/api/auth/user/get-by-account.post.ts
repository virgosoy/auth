import { useUserDb } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  const { account } = await readBody<{account: BaseUserAccount}>(event)
  const { findUserByAccount, userForFrontEnd } = useUserDb()
  const user = await findUserByAccount(account)
  return user && userForFrontEnd(user)
})
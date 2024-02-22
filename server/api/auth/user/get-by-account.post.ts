import type { BaseUserIdentity } from "../../../utils/auth-core"
import { useUserDb } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  const { account } = await readBody<{account: BaseUserIdentity}>(event)
  const { findUserByAccount: findUserByIdentity, userForFrontEnd } = useUserDb()
  const user = await findUserByIdentity(account)
  return user && userForFrontEnd(user)
})
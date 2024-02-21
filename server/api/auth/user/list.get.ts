import { useUserDb } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  const { listUser, userForFrontEnd } = useUserDb()
  const accounts = await listUser()
  // 忽略 key 为 password
  return accounts.map(a => userForFrontEnd(a))
})
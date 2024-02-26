import { useUserDb } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  const { listUser, userForFrontEnd } = useUserDb()
  const accounts = await listUser()
  return accounts.map(a => userForFrontEnd(a))
})
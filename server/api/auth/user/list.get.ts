import { userForFrontEnd } from "../../../utils/data-convert"

export default defineEventHandler(async (event) => {
  // 查询所有账号
  const accounts = await listAccount()
  // 忽略 key 为 password
  return accounts.map(a => userForFrontEnd(a))
})
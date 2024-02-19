import { userForFrontEnd } from "../../../utils/biz-data-convert"

export default defineEventHandler(async (event) => {
  // 查询所有账号
  const accounts = await listUser()
  // 忽略 key 为 password
  return accounts.map(a => userForFrontEnd(a))
})
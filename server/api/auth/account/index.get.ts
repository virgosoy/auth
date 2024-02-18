export default defineEventHandler(async (event) => {
  // 查询所有账号
  const accounts = await listAccount()
  // 忽略 key 为 password
  return accounts.map(a => {
    const { password, ...newAccount } = a
    return newAccount as Omit<User, 'password'>
  })
})
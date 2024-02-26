export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody(event)
  const { createUser } = useUserDb()
  await createUser(body)
})
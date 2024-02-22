import { useUserDb, type BaseUserCredential } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  // 请求体
  const { oldCredential, newCredential } = await readBody<{oldCredential: BaseUserCredential, newCredential: BaseUserCredential}>(event)
  const session = await useAuthSession(event)
  if(!session.data.user){
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const { changeUserCredential } = useUserDb()
  await changeUserCredential(session.data.user, oldCredential, newCredential)
  return {
    message: "Successfully change password!",
  }
})
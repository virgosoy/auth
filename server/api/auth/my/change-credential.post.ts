export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody(event)
  const session = await useAuthSession(event)
  if(!session.data.user){
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const { changeCredential } = _useAuthServer()
  await changeCredential!(session.data.user, body)
  return {
    message: "Successfully change password!",
  }
})
export default defineEventHandler(async (event) => {
  // 请求体
  const { oldPassword, newPassword } = await readBody<{oldPassword: string, newPassword: string}>(event)
  const session = await useAuthSession(event)
  if(!session.data.account){
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const user = (await findUserByAccount(session.data.account))!
  if(user.password !== await hash(oldPassword)){
    throw createError({
      statusCode: 401,
      statusMessage: 'Incorrect old password!',
    })
  }
  updateUserByAccount(session.data.account, { password: await hash(newPassword) })

  return {
    message: "Successfully change password!",
  }
})
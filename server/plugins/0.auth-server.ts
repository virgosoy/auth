/**
 * 应该按实际业务去扩展 AuthenticationHook 接口的签名
 */
export interface MyAuthenticationHook {
  (arg: {account: string, password: string}): Promise<Pick<User, 'id' | 'account' | 'name'>>
}

export default defineNitroPlugin((nirtoApp) => {
  // 钩子应根据实际业务编写
  auth.registAuthenticationHook<MyAuthenticationHook>(async ({account, password}) => {
    const user = await findUserByAccount(account)
    if(!user){
      throw createError({
        message: "Account not found! Please register.",
        statusCode: 401,
      });
    }
    if (!user.password || user.password !== (await hash(password))) {
      throw createError({
        message: "Incorrect password!",
        statusCode: 401,
      });
    }
    return {
      id: user.id,
      name: user.name,
      account: user.account,
    }
  })

  auth.registAuthorizationHook(async ({event, permKey}) => {
    return true
  })
})

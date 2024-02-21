import type { H3Event } from 'h3'
import { throw500Error } from './shared'


/**
 * 基础的 session 用户数据（一般是 PrimaryPrincipal），是实际用户数据的基类 \
 * 必须要有，来确认当前用户是谁。
 */
export type BaseUserSessionData = {} | Record<string, any>

/**
 * 认证（登录）
 * @template UserSessionData 要存放到 session 的用户数据（一般是 PrimaryPrincipal），必须要有，来确认当前用户是谁，后续会根据这个判断用户是否认证
 */
interface AuthenticationHook<Token = any, UserSessionData extends BaseUserSessionData = BaseUserSessionData> {
  /**
   * 认证
   * @param token 登录附加参数
   * @returns 要存放到 session 的用户数据（一般是 PrimaryPrincipal），必须要有，后续会根据这个判断用户是否认证
   */
  (token: Token): Promise<UserSessionData>
  // (token: {account: string, password: string}): Promise<{id: number, account: string}>
}
/**
 * 授权
 */
interface AuthorizationHook {
  /**
   * 授权
   * @param arg.event H3Event
   * @param arg.permKey 要判断的权限 key
   * @returns 是否有权限
   */
  (arg: {event: H3Event, permKey: string}): Promise<boolean>
}

interface AuthServerConfig<Token = any, UserSessionData extends BaseUserSessionData = BaseUserSessionData> {
  /**
   * 认证
   */
  authenticationHook: AuthenticationHook<Token, UserSessionData>
  /**
   * 授权
   */
  authorizationHook: AuthorizationHook
}

/**
 * 存放 {@link useAuthServer} 的执行结果，给内部的 {@link _useAuthServer} 返回。
 */
let authServer: ReturnType<typeof useAuthServer<any, any>>

/**
 * 内部使用，用于获取 {@link useAuthServer} 执行后的结果并使用
 */
export function _useAuthServer<Token = any, UserSessionData extends BaseUserSessionData = BaseUserSessionData>(): ReturnType<typeof useAuthServer<Token, UserSessionData>> {
  return authServer
}

/**
 * 使用 auth 服务端，配置初始化，一般在 server 插件中调用。 \
 * **全局只能执行一次**，多次执行可能会导致之前配置都不生效。
 * @param param0 AuthServerConfig
 */
export function useAuthServer<Token = any, UserSessionData extends BaseUserSessionData = BaseUserSessionData>({
  authenticationHook,
  authorizationHook,
}: AuthServerConfig<Token, UserSessionData>){

  /**
   * 登录
   * @param event H3Event
   * @param args 登录附加参数
   */
  async function login(event: H3Event, token: Token){
    // 认证
    const sessionData = 
      await (authenticationHook ?? throw500Error(event, 'authentication hook is not registered'))(token)
    if(!sessionData){
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication failed!',
      })
    }
    const session = await useAuthSession<UserSessionData>(event)
    await session.update({
      user: sessionData,
    })
  }

  /**
   * 登出
   * @param event H3Event
   */
  async function logout(event: H3Event) {
    const session = await useAuthSession<UserSessionData>(event)
    await session.clear();
    // 其实只要清掉 session.data.user 即可。
  }

  /**
   * 是否有权限
   * @param event 
   * @param permKey 
   */
  async function hasAuth(event: H3Event, permKey: string) {
    const result = 
        await (authorizationHook ?? throw500Error(event, 'authorization hook is not registered'))({event, permKey})
    return result
  }

  const result = {
    login,
    logout,
    hasAuth,
  }
  authServer = result
  return result
}

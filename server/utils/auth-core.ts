import type { H3Event } from 'h3'
import { throw500Error } from './shared'


/**
 * 基础的 session 用户身份（PrimaryPrincipal），如账号，或者整个用户对象，是实际用户身份的基类 \
 * 必须要有，来确认当前用户是谁。 \
 * 可以修改（例如改账号），但在所有用户中唯一。 \
 * 和 {@link BaseUserAccount} 类似，但后者方便用户输入，一般只有账号。
 */
export type BaseUserIdentity = {}

/**
 * 基础的登录令牌，登录时的参数
 */
export type BaseToken = {}

/**
 * 基础的注册信息
 */
export type BaseRegistrationInfo = Record<string, any>

/**
 * 修改证明（密码）的信息 的基类
 */
export type BaseChangeCredentialInfo = Record<string, any>

/**
 * 认证（登录）
 * @template UserIdentity 要存放到 session 的用户数据（一般是 PrimaryPrincipal），必须要有，来确认当前用户是谁，后续会根据这个判断用户是否认证
 */
interface AuthenticationHook<
  Token extends BaseToken = BaseToken,
  UserIdentity extends BaseUserIdentity = BaseUserIdentity
> {
  /**
   * 认证
   * @param token 登录附加参数
   * @returns 要存放到 session 的用户数据（一般是 PrimaryPrincipal），必须要有，后续会根据这个判断用户是否认证
   */
  (token: Token): Promise<UserIdentity>
  // (token: {account: string, password: string}): Promise<{id: number, account: string}>
}
/**
 * 授权
 */
interface AuthorizationHook<UserIdentity extends BaseUserIdentity = BaseUserIdentity> {
  /**
   * 授权
   * @param arg.event H3Event
   * @param arg.user session 中的 user 数据，即 UserIdentity
   * @param arg.permKey 要判断的权限 key
   * @returns 是否有权限
   */
  (arg: {event: H3Event, user: UserIdentity, permKey: string}): Promise<boolean>
}

interface AuthServerConfig<
  Token extends BaseToken = BaseToken, 
  UserIdentity extends BaseUserIdentity = BaseUserIdentity,
  RegistrationInfo extends BaseRegistrationInfo = BaseRegistrationInfo,
  ChangeCredentialInfo extends BaseChangeCredentialInfo = BaseChangeCredentialInfo,
> {
  /**
   * 认证
   */
  authenticationHook: AuthenticationHook<Token, UserIdentity>
  /**
   * 授权
   */
  authorizationHook: AuthorizationHook<UserIdentity>,
  /**
   * 注册，和 {@link createUser} 类似，但是是面向用户的 \
   * 非必须，因为并不是所有业务都需要在此系统注册
   * @param registrationInfo 
   * @returns UserIdentity
   * @implements 实现的时候建议底层调用 {@link createUser}
   */
  register?: (registrationInfo: RegistrationInfo) => Promise<UserIdentity>,
  /**
   * 修改用户证明（密码） \
   * 非必须，因为并不是所有业务都要在此系统改密码。
   * @param identity -
   * @param changeCredentialInfo -
   */
  changeCredential?: (identity: UserIdentity, changeCredentialInfo: ChangeCredentialInfo) => Promise<void>
}

/**
 * 存放 {@link defineAuthServer} 的执行结果，给内部的 {@link _useAuthServer} 返回。
 */
let authServer: ReturnType<typeof defineAuthServer<any, any, any, any>>

/**
 * 内部使用，用于获取 {@link defineAuthServer} 执行后的结果并使用
 */
export function _useAuthServer<
  Token extends BaseToken = BaseToken, 
  UserIdentity extends BaseUserIdentity = BaseUserIdentity,
  RegistrationInfo extends BaseRegistrationInfo = BaseRegistrationInfo,
  ChangeCredentialInfo extends BaseChangeCredentialInfo = BaseChangeCredentialInfo,
>(): ReturnType<typeof defineAuthServer<Token, UserIdentity, RegistrationInfo, ChangeCredentialInfo>> {
  return authServer
}

/**
 * 使用 auth 服务端，配置初始化，一般在 server 插件中调用。 \
 * **全局只能执行一次**，多次执行可能会导致之前配置都不生效。
 * @param param0 AuthServerConfig
 */
export function defineAuthServer<
  Token extends BaseToken = BaseToken,
  UserIdentity extends BaseUserIdentity = BaseUserIdentity,
  RegistrationInfo extends BaseRegistrationInfo = BaseRegistrationInfo,
  ChangeCredentialInfo extends BaseChangeCredentialInfo = BaseChangeCredentialInfo,
>({
  authenticationHook,
  authorizationHook,
  register,
  changeCredential,
}: AuthServerConfig<Token, UserIdentity, RegistrationInfo, ChangeCredentialInfo>){

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
    await loginByUserIdentity(event, sessionData)
  }

  /**
   * 通过 userIdentity 登录
   * @param event H3Event
   * @param userIdentity -
   */
  async function loginByUserIdentity(event: H3Event, userIdentity: UserIdentity){
    const session = await useAuthSession<UserIdentity>(event)
    await session.update({
      user: userIdentity,
    })
  }

  /**
   * 登出
   * @param event H3Event
   */
  async function logout(event: H3Event) {
    const session = await useAuthSession<UserIdentity>(event)
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
    loginByUserIdentity,
    logout,
    hasAuth,
    register,
    changeCredential,
  }
  authServer = result
  return result
}

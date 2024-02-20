import type { H3Event } from 'h3'
import { throw500Error } from './shared'


/**
 * 验证（登录）
 * @param args 
 */
export interface AuthenticationHook {
  (...args: any): Promise<any>
  // (arg: {account: string, password: string}): Promise<{id: number, account: string}>
}
/**
 * 授权
 */
interface AuthorizationHook {
  (arg: {event: H3Event, permKey: string}): Promise<boolean>
}

let authenticationHook: AuthenticationHook | undefined
let authorizationHook: AuthorizationHook | undefined

function registAuthenticationHook<T extends AuthenticationHook>(authenticationHook_: T){
  if(authenticationHook){
    throw new Error('authentication hook is already registered')
  }
  authenticationHook = authenticationHook_
}

function registAuthorizationHook(authorizationHook_: AuthorizationHook){
  if(authorizationHook){
    throw new Error('authorization hook is already registered')
  }
  authorizationHook = authorizationHook_
}

/**
 * 登录
 * @param event H3Event
 * @param args 登录附加参数
 */
export async function login<T extends AuthenticationHook>(event: H3Event, ...args: Parameters<T>){
  // 验证
  const sessionData = 
    // @ts-ignore
    await (authenticationHook ?? throw500Error(event, 'authentication hook is not registered'))(...args)
  if(!sessionData){
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication failed!',
    })
  }
  const session = await useAuthSession(event)
  session.update(sessionData)
}

/**
 * 是否有权限
 * @param event 
 * @param permKey 
 */
export async function hasAuth(event: H3Event, permKey: string) {
  const result = 
      await (authorizationHook ?? throw500Error(event, 'authorization hook is not registered'))({event, permKey})
  return result
}

export const auth = {
  registAuthenticationHook,
  registAuthorizationHook,
}

import type { H3Event } from 'h3'

/**
 * 模拟后端 404 错误 \
 * 开发环境为 403
 * @param event 
 * @example
 * ```ts
 * throw create404Error(event)
 * ```
 */
export function create404Error(event: H3Event) {
  return createError({
    data: {
      path: event.path,
    },
    // fatal: false,
    statusCode: process.env.NODE_ENV === 'development' ? 403 : 404,
    statusMessage: process.env.NODE_ENV === 'development' ? `Forbidden: ${event.path}` : `Page not found: ${event.path}`,
  })
}

/**
 * 抛出 500 （服务器）错误 \
 * 服务器自身的问题，如初始配置不对。
 */
export function throw500Error(event: H3Event, msg?: string): never {
  throw createError({
    data: {
      path: event.path,
    },
    // fatal: false,
    statusCode: 500,
    statusMessage: `Internal Server Error: ${event.path} ${msg || ''}`,
  })
}
import { useUserDb } from "../../../utils/db"

/**
 * 用于创建用户 \
 * 排除掉 User 的 password 是为了排除其 jsdoc，不然会合并一起显示。
 */
export type UserForCreate = {
  /**
   * 未加密
   */
  password: string
} & Omit<Partial<User>, 'id' | 'password'>

export default defineEventHandler(async (event) => {
  // 请求体
  const { account, password } = await readBody<UserForCreate>(event)
  
  const { createUser } = useUserDb()
  await createUser({
    account, password: await hash(password)
  })
})
import { updateUserById } from "../../../utils/db"

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<Partial<User>>(event)
  if(body.password !== undefined){
    body.password = await hash(body.password)
  }
  // 如果没有修改密码，请不要传递 password 字段，即使是 undefined，否则会被覆盖。
  await updateUserById(body)
})
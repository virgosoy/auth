import type { User } from "~/server/plugins/0.auth-server"


/**
 * 自定义 auth 客户端，固定了泛型。
 */
export const useMyAuth = useAuthClient_<
  {account: string, password: string}, 
  any, 
  {account: string, password: string},
  {oldPassword: string, newPassword: string}
>

/**
 * 自定义使用用户，固定了泛型
 */
export const useMyUser = useUser_<
  User,
  Omit<User, 'password'>,
  string
>
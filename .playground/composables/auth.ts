

/**
 * 自定义 auth 客户端，固定了泛型。
 */
export const useMyAuth = useAuthClient<
  {account: string, password: string}, 
  any, 
  {account: string, password: string}
>

/**
 * 自定义使用用户，固定了泛型
 */
export const useMyUser = useUser
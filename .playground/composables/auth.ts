

/**
 * 自定义 auth 客户端，固定了泛型。
 */
export const useMyAuth = useAuthClient<{account: string, password: string}>
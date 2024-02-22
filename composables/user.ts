

export function useUser<
  UserT extends Record<string, any> = Record<string, any>, 
  UserForFrontEndT extends Record<string, any> = Record<string, any>,
  UserAccountT extends BaseUserAccount = BaseUserAccount,
>(){
  return {
    /**
     * 用户列表
     */
    async listUser() {
      const res = await $fetch('/api/auth/user/list')
      return res as UserForFrontEndT[]
    },
    /**
     * 根据账户获取 User
     * @param account 
     */
    async findUserByAccount(account: UserAccountT) {
      const res = await $fetch('/api/auth/user/get-by-account', { 
        method: 'POST',
        body: {
          account,
        }
      })
      // 后端 null 前端是 204，返回 undefined
      return res as UserForFrontEndT | undefined
    },
    /**
     * 创建用户，密码是否加密取决于实现，user 会直接传递给后端。
     * @param user 
     */
    async createUser(user: Partial<UserT>) {
      const res = await $fetch('/api/auth/user/add', { 
        method: 'POST',
        body: user,
      })
    },
    /**
     * 更新用户，以什么做主键取决于实现，但一般建议 id 做主键。 \
     * 密码是否加密取决于实现，user 会直接传递给后端。
     * @param user 
     */
    async updateUser(user: Partial<UserT>) {
      const res = await $fetch('/api/auth/user', { 
        method: 'PUT',
        body: user,
      })
    },
  }
}
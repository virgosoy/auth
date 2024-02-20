// 此文件应该在业务端编写

import { randomUUID } from 'uncrypto';
import { defineUserDb } from '../utils/db';

/**
 * 应该按实际业务去扩展 AuthenticationHook 接口的签名
 */
export interface MyAuthenticationHook {
  (arg: {account: string, password: string}): Promise<Pick<User, 'id' | 'account' | 'name'>>
}

export default defineNitroPlugin((nirtoApp) => {
  console.info('Nitro Plugin - auth-server')

  // 钩子应根据实际业务编写
  auth.registAuthenticationHook<MyAuthenticationHook>(async ({account, password}) => {
    const user = await findUserByAccount(account)
    if(!user){
      throw createError({
        message: "Account not found! Please register.",
        statusCode: 401,
      });
    }
    if (!user.password || user.password !== (await hash(password))) {
      throw createError({
        message: "Incorrect password!",
        statusCode: 401,
      });
    }
    return {
      id: user.id,
      name: user.name,
      account: user.account,
    }
  })

  auth.registAuthorizationHook(async ({event, permKey}) => {
    return true
  })

    
  /**
   * key 前缀
   */
  const KEY_PREFIX = 'auth:users:'

  function getUserKey(account: string) {
    return `${KEY_PREFIX}${encodeURIComponent(account)}`;
  }
  defineUserDb({
    async listUser() {
      const storage = useStorage()
      const keys = await storage.getKeys(KEY_PREFIX);
      const items = await storage.getItems(keys)
      const accounts = items.map(item => item.value as User)
      return accounts
    },
    async findUserByAccount(account: string): Promise<User | null> {
      const storage = useStorage();
      const key = getUserKey(account!);
      return await storage.getItem(key);
    },
    async createUser(user: Partial<User>) {
      const storage = useStorage();
      const key = getUserKey(user.account!);
      if (await storage.hasItem(key)) {
        throw createError({ message: "Account already exists!", statusCode: 409 })
      }
      return await storage.setItem(key, {
          id: randomUUID(),
          ...user,
      });
    },
    async updateUserByAccount(account: string, updates: Partial<User>) {
      const storage = useStorage();
      const user = await findUserByAccount(account);
      if (!user) {
        throw createError({ message: 'User not found!', statusCode: 404 });
      }
      const key = getUserKey(user.account!);
      return await storage.setItem(key, {
          ...user,
          ...updates,
      });
    },
    async updateUserById(updates: Partial<User>) {
    
      const storage = useStorage()
      const keys = await storage.getKeys(KEY_PREFIX);
      const items = await storage.getItems(keys)
      const item = items.find(item => (item.value as User).id === updates.id)
      
      if (!item) {
        throw createError({ message: 'User not found!', statusCode: 404 });
      }
      
      const key = item.key
      const user = item.value as User
      const newKey = getUserKey(updates.account ?? user.account)
      if(newKey !== key){
        await storage.removeItem(key)
      }
      return await storage.setItem(newKey, {
          ...user,
          ...updates,
      });
    }
  })

})

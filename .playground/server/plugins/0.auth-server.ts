// 此文件应该在业务端编写

console.log('Module Load - auth-server')

import { randomUUID } from 'uncrypto';
// import { defineUserDb, useUserDb } from '../utils/db';
// import { useAuthServer } from '../utils/auth-core';

export default defineNitroPlugin((nirtoApp) => {
  console.info('Nitro Plugin - auth-server')

  useAuthServer({
    // 应该按实际业务去编写 AuthenticationHook 接口的签名
    authenticationHook: async ({account, password} : {account: string, password: string}) => {
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
    },
    authorizationHook: async ({event, permKey}) => {
      return true
    },
    async register(registrationInfo: {account: string, password: string}) {
      await createUser({
        account: registrationInfo.account,
        name: registrationInfo.account.split('@')[0],
        password: await hash(registrationInfo.password)
      });
      const user = (await findUserByAccount(registrationInfo.account))!
      return {
        id: user.id,
        name: user.name,
        account: user.account,
      }
    },
    async changeCredential(identity, changeCredentialInfo: {oldPassword: string, newPassword: string}) {
      const user = await findUserByAccount(identity.account)
      if(!user){
        throw createError({
          statusCode: 401,
          statusMessage: 'User not exists!',
        })
      }
      if(user.password !== await hash(changeCredentialInfo.oldPassword)){
        throw createError({
          statusCode: 401,
          statusMessage: 'Incorrect old password!',
        })
      }
      updateUserById({
        id: user.id,
        password: await hash(changeCredentialInfo.newPassword),
      })
    },
  })

    
  /**
   * key 前缀
   */
  const KEY_PREFIX = 'auth:users:'

  function getUserKey(account: string) {
    return `${KEY_PREFIX}${encodeURIComponent(account)}`;
  }
  
  async function findUserByAccount(account: string): Promise<User | null> {
    const storage = useStorage();
    const key = getUserKey(account!);
    return await storage.getItem(key);
  }
  async function createUser(user: Partial<User>) {
    const storage = useStorage();
    const key = getUserKey(user.account!);
    if (await storage.hasItem(key)) {
      throw createError({ message: "Account already exists!", statusCode: 409 })
    }
    return await storage.setItem(key, {
        id: randomUUID(),
        ...user,
    });
  }
  
  async function updateUserById(updates: Partial<User>) {
    
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
  
  defineUserDb({
    async listUser() {
      const storage = useStorage()
      const keys = await storage.getKeys(KEY_PREFIX);
      const items = await storage.getItems(keys)
      const accounts = items.map(item => item.value as User)
      return accounts
    },
    findUserByAccount,
    createUser,
    updateUserById,
    userForFrontEnd(user){
      const { password, ...result } = user
      return result
    }
  })

})

import type { BaseChangeCredentialInfo, BaseRegistrationInfo, BaseToken, BaseUserIdentity } from "../server/utils/auth-core";
import type { AuthSession } from "../server/utils/session";

console.log('Load Module - composables/auth.ts')
/**
 * 内部使用，用于服务端登录后刷新客户端 session 和重定向
 */
async function _postLogin(){
  const { $auth } = useAuthClient()
  $auth.redirectTo.value = null;
  await $auth.refreshSession();
  await navigateTo($auth.redirectTo.value || "/");
}

/**
 * 登录 \
 * 错误时返回 reject
 * @param token -
 */
async function login<Token extends BaseToken = BaseToken>(token: Token){
  await $fetch("/api/auth/login", {
    method: "POST",
    body: token,
  });
  await _postLogin()
}

/**
 * 当前用户退出登录
 */
async function logout() {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  const { $auth } = useAuthClient()
  await $auth.refreshSession();
}

/**
 * 注册并登录
 * @param registrationInfo 注册信息
 */
async function register<RegistrationInfo extends BaseRegistrationInfo>(registrationInfo: RegistrationInfo){
  await $fetch("/api/auth/register", {
    method: "POST",
    body: registrationInfo,
  });
  await _postLogin()
}

/**
 * 修改证明（即密码）
 * @param changeCredentialInfo -
 */
async function changeCredential<ChangeCredentialInfo extends BaseChangeCredentialInfo>(changeCredentialInfo: ChangeCredentialInfo) {
  await $fetch("/api/auth/my/change-credential", {
    method: "POST",
    body: changeCredentialInfo,
  })
  const { $auth } = useAuthClient()
  await $auth.refreshSession();
}

/**
 * 使用 auth 客户端
 */
export function useAuthClient<
  Token extends BaseToken = BaseToken, 
  UserIdentity extends BaseUserIdentity = BaseUserIdentity,
  RegistrationInfo extends BaseRegistrationInfo = BaseRegistrationInfo,
  ChangeCredentialInfo extends BaseChangeCredentialInfo = BaseChangeCredentialInfo,
>() {
  return {
    login: login<Token>,
    logout,
    register: register<RegistrationInfo>,
    changeCredential: changeCredential<ChangeCredentialInfo>,
    get $auth() {
      // 虽然也可以通过 .d.ts 类型化 $auth，但是对用户来说比较麻烦。
      const result = useNuxtApp().$auth 
      return result as ({sessionData: Ref<AuthSession<UserIdentity> | null>} & Omit<typeof result, 'sessionData'>)
    }
  }
}


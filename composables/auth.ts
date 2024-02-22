import type { BaseChangeCredentialInfo, BaseRegistrationInfo, BaseToken, BaseUserIdentity } from "../server/utils/auth-core";

export const useAuth = () => useNuxtApp().$auth

/**
 * 内部使用，用于服务端登录后刷新客户端 session 和重定向
 */
async function _postLogin(){
  useAuth().redirectTo.value = null;
  await useAuth().refreshSession();
  await navigateTo(useAuth().redirectTo.value || "/");
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
  await useAuth().refreshSession();
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
  await useAuth().refreshSession();
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
  }
}


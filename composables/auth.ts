import type { BaseUserSessionData } from "../server/utils/auth-core";

export const useAuth = () => useNuxtApp().$auth

/**
 * 登录 \
 * 错误时返回 reject
 * @param token -
 */
async function login<Token extends {} = {}>(token: Token){
  await $fetch("/api/auth/login", {
    method: "POST",
    body: token,
  });
  useAuth().redirectTo.value = null;
  await useAuth().refreshSession();
  await navigateTo(useAuth().redirectTo.value || "/");
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
 * 使用 auth 客户端
 */
export function useAuthClient<Token extends {} = {}, UserSessionData extends BaseUserSessionData = BaseUserSessionData>() {
  return {
    login: login<Token>,
    logout,
  }
}


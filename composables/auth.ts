export const useAuth = () => useNuxtApp().$auth

/**
 * 登录 \
 * 错误时返回 reject
 * @param account 账号
 * @param password 密码
 */
export const authLogin = async (account: string, password: string) => {
  await $fetch("/api/auth/login", {
    method: "POST",
    body: {
      account,
      password,
    },
  });
  useAuth().redirectTo.value = null;
  await useAuth().updateSession();
  await navigateTo(useAuth().redirectTo.value || "/");
};

/**
 * 注册并登录
 * @param account 账号
 * @param password 密码
 */
export const authRegister = async (account: string, password: string) => {
  await $fetch("/api/auth/register", {
    method: "POST",
    body: {
      account,
      password,
    },
  });
  return await authLogin(account, password);
};

/**
 * 当前用户退出登录
 */
export const authLogout = async () => {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await useAuth().updateSession();
};

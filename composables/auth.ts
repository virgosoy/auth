export const useAuth = () => useNuxtApp().$auth

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

export const authLogout = async () => {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await useAuth().updateSession();
};

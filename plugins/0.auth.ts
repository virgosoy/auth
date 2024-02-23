import type { AuthSession } from "../server/utils/session";

console.info('Load Module - auth')

export default defineNuxtPlugin(async (nuxtApp) => {
  console.info('Nuxt Plugin - auth')

  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return {};
  }

  const { data: sessionData, refresh: refreshSession }
    = await useFetch<AuthSession>('/api/auth/session');

  const loggedIn = computed(() => !!sessionData.value?.user);

  // Create a ref to know where to redirect the user when logged in
  const redirectTo = useState("authRedirect")

  /**
   * Add global route middleware to protect pages using:
   * 
   * definePageMeta({
   *  auth: true
   * })
   */
  // 

  addRouteMiddleware(
    "auth",
    (to) => {
      if (to.meta.auth && !loggedIn.value) {
        redirectTo.value = to.path
        return "/login";
      }
    },
    { global: true }
  );

  const currentRoute = useRoute();

  if (process.client) {
    watch(loggedIn, async (loggedIn) => {
      if (!loggedIn && currentRoute.meta.auth) {
        redirectTo.value = currentRoute.path
        await navigateTo("/login");
      }
    });
  }

  if (loggedIn.value && currentRoute.path === "/login") {
    await navigateTo(redirectTo.value || "/");
  }

  return {
    provide: {
      auth: {
        loggedIn,
        sessionData,
        redirectTo,
        refreshSession,
      },
    },
  };
});

import type { MyAuthenticationHook } from "../../plugins/0.auth-server";

export default eventHandler(async (event) => {
  const { account, password } = await readBody(event);
  await login<MyAuthenticationHook>(event, { account, password })
});

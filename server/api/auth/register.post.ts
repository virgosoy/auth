import { create404Error } from "../../utils/shared";

/**
 * 注册并登录
 */
export default eventHandler(async (event) => {
  const { register: canRegister } = useRuntimeConfig().auth
  if(!canRegister){
    throw create404Error(event);
  }
  const { register, loginByUserSessionData } = _useAuthServer()
  const body = await readBody(event);
  const userSessionData = await register!(body)
  // 设置认证（即登录态）
  await loginByUserSessionData(event, userSessionData)
  return {
    message: "Successfully registered!",
  };
});

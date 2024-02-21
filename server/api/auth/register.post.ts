import { useUserDb } from "../../utils/db";
import { create404Error } from "../../utils/shared";

export default eventHandler(async (event) => {
  const { register: canRegister } = useRuntimeConfig().auth
  if(!canRegister){
    throw create404Error(event);
  }
  const { register } = useUserDb()
  const body = await readBody(event);
  await register(body)
  return {
    message: "Successfully registered!",
  };
});

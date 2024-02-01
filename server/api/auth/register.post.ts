import { create404Error } from "../../utils/shared";

export default eventHandler(async (event) => {
  const { register } = useRuntimeConfig().auth
  if(!register){
    throw create404Error(event);
  }
  const { account, password } = await readBody(event);
  await createUser({
     account,
     name: account.split('@')[0],
     password: await hash(password)
  });
  return {
    message: "Successfully registered!",
  };
});

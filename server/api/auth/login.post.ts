import { _useAuthServer } from "../../utils/auth-core"

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { login }= _useAuthServer()
  await login(event, body)
});
import { _useAuthServer } from "../../utils/auth-core";

export default eventHandler(async (event) => {
  const { logout } = _useAuthServer()
  await logout(event)
  return {
    message: "Successfully logged out!",
  };
});

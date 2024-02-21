import type { H3Event, SessionConfig } from "h3";
import crypto from "uncrypto";
import type { BaseUserSessionData } from "./auth-core";

const sessionConfig: SessionConfig = useRuntimeConfig().auth.session || {};

export type AuthSession<UserSessionData extends BaseUserSessionData = BaseUserSessionData> = {
  /**
   * 用户，有值表示已经认证（登录）
   */
  user: UserSessionData
}

export const useAuthSession = async <UserSessionData extends BaseUserSessionData = BaseUserSessionData>(event: H3Event) => {
  const session = await useSession<AuthSession<UserSessionData>>(event, sessionConfig);
  return session
};

export const requireAuthSession = async (event: H3Event) => {
  const session = await useAuthSession(event);
  if (!session.data.user) {
    throw createError({
      message: "Not Authenticated", // Authorized
      statusCode: 401,
    });
  }
  return session;
}

export async function hash(str: string) {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

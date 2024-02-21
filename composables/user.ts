

/**
 * 注册
 * @param registrationInfo 注册信息
 */
async function register<RegistrationInfoT extends {}>(registrationInfo: RegistrationInfoT){
  await $fetch("/api/auth/register", {
    method: "POST",
    body: registrationInfo,
  });
  // TODO: 注册并登录
  // return await login({account, password});
}

export function useUser<RegistrationInfoT extends {}>(){
  return {
    register: register<RegistrationInfoT>
  }
}
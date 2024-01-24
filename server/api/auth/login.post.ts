export default eventHandler(async (event) => {
  const session = await useAuthSession(event);
  const { account, password } = await readBody(event);
  const user = await findUserByAccount(account);
  if (!user) {
    throw createError({
      message: "Account not found! Please register.",
      statusCode: 401,
    });
  }
  if (!user.password || user.password !== (await hash(password))) {
    throw createError({
      message: "Incorrect password!",
      statusCode: 401,
    });
  }
  await session.update({
      id: user.id,
      name: user.name,
      account: user.account,
  });
  return session;
});

export default eventHandler(async (event) => {
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

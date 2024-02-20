export default eventHandler(async (event) => {
  const auth = await requireAuthSession(event);
  return {
    message: `You are accessing secret api with account: ${auth.data.user.account}`,
  };
});

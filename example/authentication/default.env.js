module.exports = {
  async get_access_token() {
    if (env.access_token) return env.access_token;

    const { err, response } = await session.run("./auth.http");
    if (err) throw err;

    if (!response || !response.data || !response.data.access_token) {
      throw new Error("Authorization response has no access_token property");
    }

    const accessToken = response.data.access_token;

    session.info("get_access_token:", accessToken);
    return accessToken;
  }
};

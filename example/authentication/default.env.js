module.exports = {
  async get_access_token() {
    if (env.access_token) return env.access_token;

    const [{ error, response, request }] = await run(["./auth.http"]);
    if (error) throw error;

    if (!response || !response.data || !response.data.access_token) {
      throw new Error(
        "Authorization response has no access_token property. Got: " + response
      );
    }

    const accessToken = response.data.access_token;

    log.info("get_access_token:", accessToken);
    env.access_token = accessToken;
    return accessToken;
  }
};

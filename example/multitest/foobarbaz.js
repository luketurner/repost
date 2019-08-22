module.exports = {
  async handler() {
    session.log.info("Running foo...");
    const r1 = await session.run("foo.http");
    session.log.info("Running bar...");
    const r2 = await session.run("bar.http");
    session.log.info("Running baz...");
    const r3 = await session.run("baz.http");
    return "Done!";
  }
};

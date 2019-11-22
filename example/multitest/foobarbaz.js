module.exports = {
  async handler() {
    log.info("Running foo...");
    const r1 = await run("foo.http");
    log.info("Running bar...");
    const r2 = await run("bar.http");
    log.info("Running baz...");
    const r3 = await run("baz.http");
    return "Done!";
  }
};

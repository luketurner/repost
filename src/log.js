module.exports = session => {
  const {
    config: { verbose, raw, silent }
  } = session;

  const log = (level, ...args) => {
    if (silent || level > verbose) return;
    console.log(...args);
  };

  return {
    warn(...args) {
      if (!silent) console.warn(...args);
    },

    error(...args) {
      console.error(...args);
    },

    info(...args) {
      log(0, ...args);
    },
    verbose(...args) {
      log(1, ...args);
    },
    debug(...args) {
      log(2, ...args);
    },
    silly(...args) {
      log(3, ...args);
    }
  };
};

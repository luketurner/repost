const util = require("./util");
const path = require("path");

module.exports = session => {
  const runRequestsAndCollections = async (...requestsAndCollections) => {
    const responses = await Promise.all(
      requestsAndCollections.map(v => runRequestOrCollection(v))
    );

    return [].concat(...responses);
  };

  const runRequestOrCollection = async (
    requestOrCollection,
    { skipUnknown } = {}
  ) => {
    // TODO -- get rid of skipUknown param
    try {
      const fileType = await isRequestOrCollection(requestOrCollection);
      if (fileType === "collection") {
        return runCollection(requestOrCollection);
      } else if (fileType === "request") {
        return runRequest(requestOrCollection);
      }
      if (!skipUnknown)
        throw new Error(
          `Invalid request or collection: ${requestOrCollection}`
        );
    } catch (err) {
      return [{ request: requestOrCollection, err }];
    }
  };

  const runCollection = async collection => {
    session.log.silly(`runCollection(${collection})`);

    const filesInCollection = await util.readDir(collection);

    const collectionResponses = await Promise.all(
      filesInCollection
        .map(f => path.join(collection, f))
        .map(f => runRequestOrCollection(f, { skipUnknown: true }))
    );

    return [].concat(...collectionResponses.filter(v => v));
  };

  const runRequest = async request => {
    try {
      session.log.silly(`runRequest(${request})`);
      const [preTransformRequest, testHooks] = await Promise.all([
        session.request.parse(request),
        session.hooks.getTestHooks(request)
      ]);

      session.log.silly(`transform request ${request}`);
      const postTransformRequest = await testHooks.before(preTransformRequest);

      session.log.verbose(`sending ${request}`);
      const preTransformResponse = await (postTransformRequest.handler
        ? postTransformRequest.handler()
        : util.sendHTTPRequest(postTransformRequest));

      session.log.silly(`transform response ${request}`);
      const response = await testHooks.after(preTransformResponse);

      return [{ request, response }];
    } catch (err) {
      return [{ request, err }];
    }
  };

  const isRequestOrCollection = async filename => {
    if (!filename) return false;
    const stat = await util.statFile(filename);
    if (stat.isDirectory()) {
      const markerFilename = path.join(filename, ".repost-collection");
      if (await util.accessFile(markerFilename)) {
        // TODO should be configurable
        return "collection";
      }
      return false;
    } else {
      if (/.+\.env\.js(on)?$/.test(filename)) {
        return false; // .env.js and .env.json files are never requests, even if extensions are allowed
      }

      const requestExtensions = [".js", ".http"]; // TODO should be configurable
      for (const ext of requestExtensions) {
        if (filename.endsWith(ext)) return "request";
      }

      return false;
    }
  };

  return runRequestsAndCollections;
};

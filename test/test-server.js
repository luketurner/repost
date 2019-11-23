const express = require("express");
const app = express();

app.get("/auth", (req, res) => {
  res.send({
    access_token: "test_token",
    expires: new Date(Date.now() + 1000000).toISOString()
  });
});

app.get("*", (req, res) => {
  res.send("Success!");
});

let server;

module.exports = {
  async listen() {
    if (!server) {
      return new Promise((resolve, reject) => {
        server = app.listen(8000, () => resolve());
      });
    }
  },
  close() {
    if (server) {
      server.close();
    }
  }
};

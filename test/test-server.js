const express = require('express');
const app = express();

app.get('*', (req, res) => {
  console.log(req.method, req.url);
  res.send('Success!');
});

app.get('/auth', (req, res) => {
  console.log(req.method, req.url);
  res.send({
    access_token: '12345',
    expires: new Date(Date.now() + 1000000).toISOString()
  });
});

app.listen(8000, () => console.log(`Example app listening on port 8000!`))
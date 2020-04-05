const express = require('express');
var redis = require('redis');
var { promisify } = require('util');

const app = express();
const port = 8000;
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

app.get('/jobs', async (req, res) => {
  const jobs = await getAsync('github');

  return res.send(jobs);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

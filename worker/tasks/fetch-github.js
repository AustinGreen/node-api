var axios = require("axios");
var redis = require("redis");
var { promisify } = require("util");

const client = redis.createClient();
const baseUrl = "https://jobs.github.com/positions.json";
const generateUrl = (n) => `${baseUrl}?page=${n + 1}`;

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

async function fetchGithub(jobs = [], pageNum = 1) {
  await Promise.all([
    axios(generateUrl(pageNum)),
    axios(generateUrl(pageNum + 1)),
    axios(generateUrl(pageNum + 2)),
    axios(generateUrl(pageNum + 3)),
    axios(generateUrl(pageNum + 4)),
  ]).then((values) => {
    const newJobs = values.reduce((acc, curr) => [...acc, ...curr.data], jobs);
    if (values[4].data.length === 0) {
      setAsync('github', JSON.stringify(newJobs));
      return newJobs;
    }
    return fetchGithub(newJobs, pageNum + 5);
  });
}

module.exports = fetchGithub;

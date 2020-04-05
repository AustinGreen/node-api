import axios from "axios";
import redis from "redis";
import { promisify } from "util";
import 'dotenv/config';

const client = redis.createClient();
const generateUrl = n => `${process.env.BASE_URL}?page=${n + 1}`;

const setAsync = promisify(client.set).bind(client);

const filterJobs = (jobs) =>
  jobs.filter(
    (job) =>
      job.title.toLowerCase().includes("lead") ||
      job.title.toLowerCase().includes("senior")
  );

async function fetchGithub(jobs = [], pageNum = 1) {
  await Promise.all([
    axios(generateUrl(pageNum)),
    axios(generateUrl(pageNum + 1)),
    axios(generateUrl(pageNum + 2)),
    axios(generateUrl(pageNum + 3)),
    axios(generateUrl(pageNum + 4)),
  ]).then((values) => {
    const newJobs = values.reduce((acc, curr) => [...acc, ...curr.data], jobs);
    const filteredJobs = filterJobs(newJobs);
    if (values[4].data.length === 0) {
      setAsync("github", JSON.stringify(filteredJobs));
      return filteredJobs;
    }
    return fetchGithub(newJobs, pageNum + 5);
  });
}

export default fetchGithub;

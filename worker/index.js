var CronJob = require('cron').CronJob;
var fetchGithub = require('./tasks/fetch-github');

new CronJob('* * * * *', () => fetchGithub([], 1), null, true, 'America/Los_Angeles');

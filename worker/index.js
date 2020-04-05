import CronJob from 'cron';
import fetchGithub from './tasks/fetch-github';

new CronJob('* * * * *', () => fetchGithub([], 1), null, true, 'America/Los_Angeles');

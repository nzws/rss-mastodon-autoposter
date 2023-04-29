import { CronJob } from 'cron';
import { env } from './env';
import { getFeeds } from './feed';
import { postToMastodon } from './mastodon';

const runner = async () => {
  try {
    const items = await getFeeds(
      env.RSS_URL,
      env.RSS_IGNORE_KEYWORDS.split(',')
    );

    if (items.length === 0) {
      return;
    }

    const posts = items.map(item => `${item.body}\n\n${item.link}`).reverse();
    for (const post of posts) {
      await postToMastodon(post);
    }
  } catch (error) {
    console.error(error);
  }
};

const job = new CronJob(env.CRON_SCHEDULE, runner);

job.start();
void runner();

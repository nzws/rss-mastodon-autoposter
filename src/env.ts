import { envsafe, str } from 'envsafe';

export const env = envsafe({
  CRON_SCHEDULE: str({
    default: '*/10 * * * *',
    allowEmpty: true
  }),
  MASTODON_DOMAIN: str({
    default: 'don.nzws.me',
    allowEmpty: true
  }),
  MASTODON_TOKEN: str({}),
  RSS_URL: str({}),
  RSS_IGNORE_KEYWORDS: str({
    desc: 'Ignore keywords separated by comma',
    default: '',
    allowEmpty: true
  })
});

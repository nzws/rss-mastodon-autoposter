import { login } from 'masto';
import { env } from './env';

const masto = login({
  url: env.MASTODON_DOMAIN,
  accessToken: env.MASTODON_TOKEN
});

const atMark = /@/g;

export const postToMastodon = async (text: string) => {
  const client = await masto;

  text = text.replace(atMark, '@.');

  const result = await client.v1.statuses.create({
    status: text,
    visibility: 'unlisted'
  });
  console.log('Posted to Mastodon: ' + result.url);
};

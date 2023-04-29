import Parser from 'rss-parser';

const lastUrls = new Map<string, string>();

const parser = new Parser();

type Article = {
  title: string;
  link: string;
  pubDate: string;
};

const getLatestArticles = async (feedUrl: string) => {
  const feed = await parser.parseURL(feedUrl);
  const sortedArticles = (
    feed.items.filter(x => x.link && x.pubDate && x.title) as Article[]
  ).sort((a, b) => {
    const aDate = new Date(a.pubDate);
    const bDate = new Date(b.pubDate);
    return bDate.getTime() - aDate.getTime();
  });

  if (!lastUrls.has(feedUrl)) {
    lastUrls.set(feedUrl, sortedArticles[0].link);
    console.log('Initialized: ' + sortedArticles[0].link);
    return [];
  }

  let articles: Article[] = [];
  for (const article of sortedArticles) {
    if (article.link === lastUrls.get(feedUrl)) {
      break;
    }

    articles.push(article);
  }

  lastUrls.set(feedUrl, sortedArticles[0].link);

  return articles;
};

const filterIgnoreArticles = (articles: Article[], keywords: string[]) => {
  return articles.filter(
    article => !keywords.some(keyword => article.title.includes(keyword))
  );
};

const linkConverter = (link: string) => {
  const url = new URL(link);

  url.hostname = 'twitter.com';

  return url.toString();
};

type FeedItem = {
  body: string;
  link: string;
};

export const getFeeds = async (
  feedUrl: string,
  ignoreKeywords: string[]
): Promise<FeedItem[]> => {
  const articles = await getLatestArticles(feedUrl);
  const filteredArticles = filterIgnoreArticles(articles, ignoreKeywords);
  console.log(
    'New articles: ' + filteredArticles.length,
    ' / filtered: ' + articles.length
  );

  return filteredArticles.map(article => {
    return {
      body: article.title,
      link: linkConverter(article.link)
    };
  });
};

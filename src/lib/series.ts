export interface SeriesMetadata {
  id: string;
  title: string;
  part: number;
}

export interface SeriesPostLike {
  slug: string;
  body?: string;
  data: {
    title: string;
    description: string;
    date?: Date;
    featured?: number;
    draft?: boolean;
    series?: SeriesMetadata;
  };
}

export interface SeriesNavInfo {
  seriesId: string;
  seriesTitle: string;
  currentPart: number;
  totalParts: number;
  prevPost: SeriesPostLike | null;
  nextPost: SeriesPostLike | null;
  seriesPosts: SeriesPostLike[];
}

export interface SeriesSummary {
  id: string;
  title: string;
  totalParts: number;
  posts: SeriesPostLike[];
  firstPost: SeriesPostLike;
  latestPost: SeriesPostLike;
}

/**
 * Filter and sort posts belonging to a given series.
 * Only returns non-draft posts, ordered strictly ascending by series.part.
 */
export function getSeriesPosts<T extends SeriesPostLike>(
  allPosts: T[],
  seriesId: string
): T[] {
  return allPosts
    .filter((post) => !post.data.draft && post.data.series?.id === seriesId)
    .sort((a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0));
}

/**
 * Returns navigation details (prev, next, curriculum list) for a post in a series.
 * Returns null if the post does not belong to a series.
 */
export function getSeriesNav<T extends SeriesPostLike>(
  allPosts: T[],
  currentSlug: string
): {
  seriesId: string;
  seriesTitle: string;
  currentPart: number;
  totalParts: number;
  prevPost: T | null;
  nextPost: T | null;
  seriesPosts: T[];
} | null {
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  if (!currentPost || !currentPost.data.series) {
    return null;
  }

  const seriesId = currentPost.data.series.id;
  const seriesTitle = currentPost.data.series.title;
  const seriesPosts = getSeriesPosts(allPosts, seriesId);
  const currentIndex = seriesPosts.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) {
    return null;
  }

  const prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  return {
    seriesId,
    seriesTitle,
    currentPart: currentPost.data.series.part,
    totalParts: seriesPosts.length,
    prevPost,
    nextPost,
    seriesPosts,
  };
}

/**
 * Returns a list of all unique series across the blog, ordered by most recent post date.
 */
export function getAllSeries<T extends SeriesPostLike>(allPosts: T[]): {
  id: string;
  title: string;
  totalParts: number;
  posts: T[];
  firstPost: T;
  latestPost: T;
}[] {
  const seriesMap = new Map<string, { id: string; title: string; posts: T[] }>();

  for (const post of allPosts) {
    if (post.data.draft || !post.data.series) continue;
    const { id, title } = post.data.series;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, { id, title, posts: [] });
    }
    seriesMap.get(id)!.posts.push(post);
  }

  const result = [];
  for (const [id, item] of seriesMap.entries()) {
    const sorted = item.posts.sort(
      (a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0)
    );
    result.push({
      id,
      title: item.title,
      totalParts: sorted.length,
      posts: sorted,
      firstPost: sorted[0],
      latestPost: sorted[sorted.length - 1],
    });
  }

  return result;
}

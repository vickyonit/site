import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSeriesPosts, getSeriesNav, getAllSeries } from "../src/lib/series.ts";

const mockPosts = [
  {
    slug: "post-part-1",
    data: {
      title: "Part 1 Post",
      description: "First part description",
      draft: false,
      series: {
        id: "customer-support-custom-runtime",
        title: "Building Customer Support Agent with Custom Runtime",
        part: 1,
      },
    },
  },
  {
    slug: "post-part-0",
    data: {
      title: "Part 0 Problem Context",
      description: "Foundational problem context",
      draft: false,
      series: {
        id: "customer-support-custom-runtime",
        title: "Building Customer Support Agent with Custom Runtime",
        part: 0,
      },
    },
  },
  {
    slug: "post-part-2",
    data: {
      title: "Part 2 Post",
      description: "Second part description",
      draft: false,
      series: {
        id: "customer-support-custom-runtime",
        title: "Building Customer Support Agent with Custom Runtime",
        part: 2,
      },
    },
  },
  {
    slug: "standalone-post",
    data: {
      title: "Standalone Essay",
      description: "Not part of any series",
      draft: false,
    },
  },
  {
    slug: "draft-part-3",
    data: {
      title: "Draft Part 3",
      description: "Draft part",
      draft: true,
      series: {
        id: "customer-support-custom-runtime",
        title: "Building Customer Support Agent with Custom Runtime",
        part: 3,
      },
    },
  },
];

describe("Series Utilities", () => {
  it("getSeriesPosts returns sorted non-draft posts for a series", () => {
    const posts = getSeriesPosts(mockPosts, "customer-support-custom-runtime");
    assert.equal(posts.length, 3);
    assert.equal(posts[0].slug, "post-part-0");
    assert.equal(posts[1].slug, "post-part-1");
    assert.equal(posts[2].slug, "post-part-2");
  });

  it("getSeriesNav returns null for non-series posts", () => {
    const nav = getSeriesNav(mockPosts, "standalone-post");
    assert.equal(nav, null);
  });

  it("getSeriesNav returns correct prev and next pointers for first post (Part 0)", () => {
    const nav = getSeriesNav(mockPosts, "post-part-0");
    assert.ok(nav);
    assert.equal(nav.currentPart, 0);
    assert.equal(nav.totalParts, 3);
    assert.equal(nav.prevPost, null);
    assert.equal(nav.nextPost?.slug, "post-part-1");
    assert.equal(nav.seriesTitle, "Building Customer Support Agent with Custom Runtime");
  });

  it("getSeriesNav returns correct prev and next pointers for intermediate post (Part 1)", () => {
    const nav = getSeriesNav(mockPosts, "post-part-1");
    assert.ok(nav);
    assert.equal(nav.currentPart, 1);
    assert.equal(nav.prevPost?.slug, "post-part-0");
    assert.equal(nav.nextPost?.slug, "post-part-2");
  });

  it("getSeriesNav returns correct prev and next pointers for last post (Part 2)", () => {
    const nav = getSeriesNav(mockPosts, "post-part-2");
    assert.ok(nav);
    assert.equal(nav.currentPart, 2);
    assert.equal(nav.prevPost?.slug, "post-part-1");
    assert.equal(nav.nextPost, null);
  });

  it("getAllSeries aggregates series with correct metadata", () => {
    const all = getAllSeries(mockPosts);
    assert.equal(all.length, 1);
    assert.equal(all[0].id, "customer-support-custom-runtime");
    assert.equal(all[0].title, "Building Customer Support Agent with Custom Runtime");
    assert.equal(all[0].posts.length, 3);
    assert.equal(all[0].firstPost.slug, "post-part-0");
  });
});

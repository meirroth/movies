// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MovieCard from "~/components/MovieCard.vue";

describe("MovieCard", () => {
  const mockMovie = {
    id: 1,
    title: "Test Movie",
    poster_path: "/test-poster.jpg",
    release_date: "2023-01-15",
    vote_average: 7.654,
  };

  it("renders movie card correctly", async () => {
    const wrapper = await mountSuspended(MovieCard, {
      props: {
        movie: mockMovie as any,
      },
    });

    // Test if title is rendered
    expect(wrapper.text()).toContain("Test Movie");

    // Test if image src is correct
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(
      "https://image.tmdb.org/t/p/w500/test-poster.jpg"
    );
    expect(img.attributes("alt")).toBe("Test Movie");

    // Test if date is formatted correctly
    expect(wrapper.text()).toContain("Jan 15, 2023");

    // Test if rating is formatted correctly (rounded to 1 decimal)
    expect(wrapper.text()).toContain("7.7");
  });

  it("generates correct movie link", async () => {
    const wrapper = await mountSuspended(MovieCard, {
      props: {
        movie: mockMovie as any,
      },
    });

    const link = wrapper.find("a");
    expect(link.attributes("href")).toBe("/1");
  });

  it("applies hover effect classes", async () => {
    const wrapper = await mountSuspended(MovieCard, {
      props: {
        movie: mockMovie as any,
      },
    });

    const img = wrapper.find("img");
    expect(img.classes()).toContain("group-hover:opacity-75");
  });
});

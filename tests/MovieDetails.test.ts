// @vitest-environment nuxt
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";

import MovieDetails from "~/components/MovieDetails.vue";

describe("MovieDetails", () => {
  it("renders loading state", async () => {
    const wrapper = await mountSuspended(MovieDetails);
    expect(wrapper.text()).toContain("Loading...");
  });

  it("renders movie details", async () => {
    const wrapper = await mountSuspended(MovieDetails, {
      props: {
        movie: {
          id: 1,
          title: "Movie Title",
          overview: "Movie Overview",
        } as any,
      },
    });
    expect(wrapper.text()).toContain("Movie Title");
    expect(wrapper.text()).toContain("Movie Overview");
  });
});

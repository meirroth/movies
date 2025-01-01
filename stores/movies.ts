import type { Movie, MovieResponse } from "~/types/movies";

interface MoviesState {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export const useMoviesStore = defineStore("moviesStore", {
  state: (): MoviesState => ({
    movies: [],
    currentPage: 0,
    totalPages: 0,
    isLoading: false,
    error: null,
    hasMore: true,
  }),

  getters: {
    canLoadMore: (state) => state.hasMore && !state.isLoading,
  },

  actions: {
    async fetchPopularMovies(page: number = 1) {
      const { tmdbApiKey, tmdbApiUrl } = useRuntimeConfig().public;

      try {
        this.isLoading = true;
        this.error = null;

        const response = await $fetch<MovieResponse>(
          `${tmdbApiUrl}/movie/popular`,
          {
            params: {
              language: "en-US",
              page: page.toString(),
            },
            headers: {
              Authorization: `Bearer ${tmdbApiKey}`,
            },
          }
        );

        if (page === 1) {
          this.movies = response.results;
        } else {
          this.movies = [...this.movies, ...response.results];
        }

        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.hasMore = response.page < response.total_pages;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch movies";
        console.error("Error fetching movies:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadMoreMovies() {
      if (this.canLoadMore) {
        await this.fetchPopularMovies(this.currentPage + 1);
      }
    },

    resetStore() {
      this.movies = [];
      this.currentPage = 0;
      this.totalPages = 0;
      this.isLoading = false;
      this.error = null;
      this.hasMore = true;
    },
  },
});

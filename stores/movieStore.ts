import type { Movie, MovieResponse } from "~/types/movie";

interface StoreState {
  movie: Movie | null;
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export const useMovieStore = defineStore("movieStore", {
  state: (): StoreState => ({
    movie: null,
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

    async loadMovieDetails(movieId: number) {
      const { tmdbApiKey, tmdbApiUrl } = useRuntimeConfig().public;

      try {
        this.isLoading = true;
        this.error = null;

        const response = await $fetch<Movie>(`${tmdbApiUrl}/movie/${movieId}`, {
          params: {
            language: "en-US",
          },
          headers: {
            Authorization: `Bearer ${tmdbApiKey}`,
          },
        });

        this.movie = response;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch movie";
        console.error("Error fetching movie:", error);
      }
    },
  },
});

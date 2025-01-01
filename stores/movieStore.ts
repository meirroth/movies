import type { Movie, MovieResponse } from "~/types/movie";

interface StoreState {
  movie: Movie | null;
  movieLoading: boolean;
  movieError: string | null;
  movies: Movie[];
  moviesLoading: boolean;
  moviesError: string | null;
  moviesCurrentPage: number;
  moviesTotalPages: number;
  moviesHasMore: boolean;
  releases: Movie[];
  releasesLoading: boolean;
  releasesError: string | null;
}

export const useMovieStore = defineStore("movieStore", {
  state: (): StoreState => ({
    movie: null,
    movieLoading: false,
    movieError: null,
    movies: [],
    moviesLoading: false,
    moviesError: null,
    moviesCurrentPage: 0,
    moviesTotalPages: 0,
    moviesHasMore: true,
    releases: [],
    releasesLoading: false,
    releasesError: null,
  }),

  getters: {
    canLoadMoreMovies: (state) => state.moviesHasMore && !state.moviesLoading,
  },

  actions: {
    async fetchPopularMovies(page: number = 1) {
      const { tmdbApiKey, tmdbApiUrl } = useRuntimeConfig().public;

      try {
        this.moviesLoading = true;
        this.moviesError = null;

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

        this.moviesCurrentPage = response.page;
        this.moviesTotalPages = response.total_pages;
        this.moviesHasMore = response.page < response.total_pages;
      } catch (error) {
        this.moviesError =
          error instanceof Error ? error.message : "Failed to fetch movies";
        console.error("Error fetching movies:", error);
      } finally {
        this.moviesLoading = false;
      }
    },

    async loadMoreMovies() {
      if (this.canLoadMoreMovies) {
        await this.fetchPopularMovies(this.moviesCurrentPage + 1);
      }
    },

    async loadMovieDetails(movieId: number) {
      const { tmdbApiKey, tmdbApiUrl } = useRuntimeConfig().public;

      try {
        this.movieLoading = true;
        this.movieError = null;

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
        this.movieError =
          error instanceof Error ? error.message : "Failed to fetch movie";
        console.error("Error fetching movie:", error);
      } finally {
        this.movieLoading = false;
      }
    },

    async getReleasesInDateRange(startDate: Date, endDate: Date) {
      const { tmdbApiKey, tmdbApiUrl } = useRuntimeConfig().public;

      try {
        this.releasesLoading = true;
        this.releasesError = null;
        this.releases = [];

        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await $fetch<MovieResponse>(
            `${tmdbApiUrl}/discover/movie`,
            {
              params: {
                language: "en-US",
                sort_by: "release_date.desc",
                "primary_release_date.gte": startDate
                  .toISOString()
                  .split("T")[0],
                "primary_release_date.lte": endDate.toISOString().split("T")[0],
                page: page,
              },
              headers: {
                Authorization: `Bearer ${tmdbApiKey}`,
              },
            }
          );

          this.releases = [...this.releases, ...response.results];
          totalPages = response.total_pages;
          page++;
          if (page > 40) {
            // For performance reasons, limit the number of pages to fetch
            break;
          }
        }
      } catch (error) {
        this.releasesError =
          error instanceof Error ? error.message : "Failed to fetch releases";
        console.error("Error fetching releases:", error);
      } finally {
        this.releasesLoading = false;
      }
    },
  },
});

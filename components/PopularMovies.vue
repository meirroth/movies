<template>
  <div class="p-5 h-full overflow-y-auto" ref="scrollContainer">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
    >
      <MovieCard v-for="movie in movies" :key="movie.id" :movie />
      <div v-if="isLoading" class="text-center col-span-full">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

const store = useMovieStore();
const scrollContainer = ref<HTMLElement>();

const movies = computed(() => store.movies);
const isLoading = computed(() => store.moviesLoading);
const canLoadMoreMovies = computed(() => store.canLoadMoreMovies);

await callOnce(async () => {
  await store.fetchPopularMovies();
});

useInfiniteScroll(
  scrollContainer,
  async () => {
    if (canLoadMoreMovies.value) {
      await store.loadMoreMovies();
    }
  },
  { distance: 10 }
);
</script>

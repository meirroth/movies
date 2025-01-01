<template>
  <div class="p-5 h-screen overflow-y-auto" ref="scrollContainer">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
    >
      <MovieCard v-for="movie in movies" :key="movie.id" :movie />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useMoviesStore();

const movies = computed(() => store.movies);

await callOnce(async () => {
  await store.fetchPopularMovies();
});
</script>

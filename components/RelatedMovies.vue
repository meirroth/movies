<template>
  <div v-if="isLoading" class="text-center col-span-full">
    Loading related movies...
  </div>
  <div v-else>
    <h2 class="text-xl font-semibold text-gray-400 mb-4">Related Movies</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <MovieCard v-for="movie in relatedMovies" :key="movie.id" :movie />
    </div>
  </div>
</template>

<script setup lang="ts">
const { movieId } = defineProps<{
  movieId: number;
}>();
const store = useMovieStore();
const relatedMovies = computed(() => store.relatedMovies);
const isLoading = computed(() => store.relatedMoviesLoading);

onMounted(async () => {
  await store.fetchRelatedMovies(movieId);
});
</script>

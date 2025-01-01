<template>
  <MovieDetails v-if="movie" :movie />
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
const id = useRoute().params.id;
const store = useMovieStore();
const movie = computed(() => store.movie);

await callOnce(async () => {
  await store.loadMovieDetails(Number(id));
});

useSeoMeta({
  title: movie.value?.title,
  description: movie.value?.overview,
});
</script>

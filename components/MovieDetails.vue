<template>
  <div v-if="movie" class="lg:flex lg:items-start lg:space-x-8 p-5">
    <img
      :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
      :alt="movie.title"
      class="w-full lg:w-2/5 h-auto object-cover object-center rounded-lg shadow-lg"
    />
    <div class="mt-5 lg:mt-0 lg:flex-1">
      <h1 class="text-3xl font-bold text-gray-200">{{ movie.title }}</h1>
      <div class="flex items-center justify-between mt-2">
        <p class="text-sm text-gray-400">
          {{ formatDate(movie.release_date) }}
        </p>
        <p class="text-sm text-gray-400 flex items-center">
          <UIcon
            name="i-heroicons-star-solid"
            class="w-4 h-4 text-yellow-500 mr-1"
          />
          {{ formatRating(movie.vote_average) }}
        </p>
      </div>
      <p class="mt-4 text-gray-300">{{ movie.overview }}</p>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import type { Movie } from "~/types/movie";

const { movie } = defineProps<{
  movie: Movie;
}>();
</script>

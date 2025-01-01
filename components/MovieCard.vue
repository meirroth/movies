<template>
  <NuxtLink
    :to="`${movie.id}`"
    class="bg-white shadow-lg rounded-lg overflow-hidden group"
  >
    <img
      :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
      :alt="movie.title"
      class="w-full h-48 object-cover object-center group-hover:opacity-75"
    />
    <div class="p-4">
      <h2 class="text-xl text-gray-500 font-semibold">{{ movie.title }}</h2>
      <div class="flex items-center justify-between mt-2">
        <p class="text-sm text-gray-500">{{ formattedDate }}</p>
        <p class="text-sm text-gray-500">
          <UIcon
            name="i-heroicons-star-solid"
            class="w-4 h-4 text-yellow-500"
          />
          {{ formattedRating }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Movie } from "~/types/movie";

const { movie } = defineProps<{
  movie: Movie;
}>();

const formattedDate = formatDate(movie.release_date);
const formattedRating = Math.round(movie.vote_average * 10) / 10;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

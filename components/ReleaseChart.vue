<template>
  <div class="w-full max-w-2xl mx-auto p-4">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Filler
);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const store = useMovieStore();
const releases = computed(() => store.releases);

onMounted(async () => {
  if (!chartCanvas.value) return;

  // Get last 90 days of releases
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  await store.getReleasesInDateRange(startDate, endDate);

  // Process data for chart
  const dateCount = new Map<string, number>();
  releases.value.forEach((movie) => {
    const date = formatDate(movie.release_date);
    dateCount.set(date, (dateCount.get(date) || 0) + 1);
  });

  // Create sorted arrays for chart data
  const dates = Array.from(dateCount.keys()).sort();
  const counts = dates.map((date) => dateCount.get(date) || 0);

  new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Movie Releases",
          data: counts,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Movie Releases (Last 90 Days)",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Release Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Movies",
          },
          beginAtZero: true,
        },
      },
    },
  });
});
</script>

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@pinia/nuxt"],

  runtimeConfig: {
    public: {
      tmdbApiUrl: process.env.TMDB_API_URL,
      tmdbApiKey: process.env.TMDB_API_KEY,
    },
  },
});

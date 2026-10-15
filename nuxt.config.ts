export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@pinia/colada-nuxt"],
  app: {
    head: {
      title: "SSR head repro",
      titleTemplate: "%s · SSR head repro",
    },
  },
  nitro: {
    prerender: {
      routes: ["/posts/1", "/posts/11"],
    },
  },
});

<script setup lang="ts">
type JsonPlaceholderPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type JsonPlaceholderUser = {
  id: number;
  name: string;
};

const route = useRoute();
const postId = computed(() => Number(route.params.id));

const { data: post } = useQuery(() => ({
  key: ["public-post", { id: postId.value }],
  query: async () => {
    if (!Number.isInteger(postId.value) || postId.value < 1) {
      throw createError({ statusCode: 404, statusMessage: "Post not found" });
    }

    const result = await $fetch<JsonPlaceholderPost>(
      `https://jsonplaceholder.typicode.com/posts/${postId.value}`,
    );
    const author = await $fetch<JsonPlaceholderUser>(
      `https://jsonplaceholder.typicode.com/users/${result.userId}`,
    );

    return { ...result, author };
  },
}));

useSeoMeta({
  title: () => post.value?.author.name,
  description: () => post.value?.body,
  ogTitle: () => post.value?.author.name,
  ogDescription: () => post.value?.body,
});
</script>

<template>
  <main v-if="post" :data-post-id="post.id">
    <h1>{{ post.author.name }}</h1>
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>
    <NuxtLink :to="post.id === 1 ? '/posts/11' : '/posts/1'">
      {{ post.id === 1 ? "Next post" : "Previous post" }}
    </NuxtLink>
  </main>
</template>

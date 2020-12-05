<template>
  <div>
    <div v-for="post in posts">
      <router-link :to="post.path">{{ post.frontmatter.title }}</router-link> -
      {{ new Date(post.frontmatter.date).toDateString() }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['path'],
  computed: {
    posts() {
      return this.$site.pages
        .filter((x) => x.path.startsWith(this.path) && !x.path.endsWith(this.path))
        .sort(
          (x, y) => new Date(y.frontmatter.date) - new Date(x.frontmatter.date)
        );
    },
  },
};
</script>
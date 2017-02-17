<template>
  <div>
    <post class="post" v-for="post in posts" v-bind:key="post.id" v-bind:post="post"/>
  </div>
</template>

<script>
import Post from './Post'

export default {
  name: 'posts',
  components: {Post},
  props: ['posts']
}
</script>

<style scoped>
</style>

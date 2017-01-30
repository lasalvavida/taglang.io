<template>
  <div>
    <post v-for="post in posts" v-bind:post="post">
    </post>
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

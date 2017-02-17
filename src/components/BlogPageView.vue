<template>
  <div>
    <post v-for="post in posts" v-bind:post="post"/>
    <div>
      <button
        v-if="page > 0"
        v-on:click="prevPage()"
        class="pure-button">Newer Posts</button>
      <button
        v-if="(page + 1) * 3 < numPosts"
        v-on:click="nextPage()"
        class="pure-button">Older Posts</button>
    </div>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
import Post from './Post'
import getNumPosts from '../lib/api/getNumPosts'
import getPosts from '../lib/api/getPosts'

export default {
  components: {
    Post,
    VueRouter
  },
  data () {
    return {
      posts: [],
      numPosts: 0
    }
  },
  methods: {
    load () {
      var that = this
      getPosts({ page: this.page })
        .then(function (posts) {
          for (var i = 0; i < posts.length; i++) {
            that.posts.push(posts[i])
          }
        })
    },
    nextPage () {
      this.$router.push('/blog/page/' + (this.page + 1))
    },
    prevPage () {
      this.$router.push('/blog/page/' + (this.page - 1))
    }
  },
  mounted () {
    var that = this
    this.load()
    getNumPosts()
      .then(function (numPosts) {
        that.numPosts = numPosts
      })
  },
  watch: {
    page () {
      while (this.posts.length > 0) {
        this.posts.pop()
      }
      this.load()
    }
  },
  props: {
    page: {
      type: Number
    }
  }
}
</script>

<style scoped>
</style>

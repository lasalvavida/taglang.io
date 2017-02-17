<template>
  <div>
    <div v-if="post !== undefined">
      <post v-bind:post="post"/>
    </div>
    <div>
      <button
        v-if="nextId !== undefined"
        v-on:click="nextPost()"
        class="pure-button">Next Post</button>
      <button
        v-if="prevId !== undefined"
        v-on:click="prevPost()"
        class="pure-button">Previous Post</button>
    </div>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
import Post from './Post'
import getNextPostId from '../lib/api/getNextPostId'
import getPostById from '../lib/api/getPostById'
import getPrevPostId from '../lib/api/getPrevPostId'

export default {
  components: {
    Post,
    VueRouter
  },
  data () {
    return {
      nextId: undefined,
      prevId: undefined,
      post: undefined
    }
  },
  methods: {
    load () {
      var that = this
      this.nextId = undefined
      this.prevId = undefined
      this.post = undefined
      getPostById(that.id)
        .then(function (post) {
          that.post = post
        })
      getNextPostId(that.id)
        .then(function (nextId) {
          that.nextId = nextId
        })
      getPrevPostId(that.id)
        .then(function (prevId) {
          that.prevId = prevId
        })
    },
    nextPost () {
      this.$router.push('/blog/post/' + (this.nextId))
    },
    prevPost () {
      this.$router.push('/blog/post/' + (this.prevId))
    }
  },
  mounted () {
    this.load()
  },
  watch: {
    id () {
      this.load()
    }
  },
  props: ['id']
}
</script>

<style scoped>
</style>

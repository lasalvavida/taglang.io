<template>
  <div v-on:mouseover="active = true" v-on:mouseout="active = false">
    <div class="date"> {{ post.date.toDateString() }} </div>
    <div>
      <span v-on:click="viewPost" class="title"> {{ post.title }} </span>
    </div>
    <div>
      <component v-for="component in loadComponents" :is="component"></component>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'post',
  data () {
    return {
      active: false,
      loadComponents: []
    }
  },
  props: ['post'],
  methods: {
    viewPost () {
      this.$router.push('/blog/post/' + this.post.id)
    }
  },
  mounted: function () {
    var postId = this.post.id
    var that = this
    var postModule = require('bundle!../posts/' + postId + '/Content')
    Vue.component(postId, postModule)
    that.loadComponents.push(postId)
  }
}
</script>

<style scoped>
div {
  padding: 10px;
}

.date {
  font-size: 14px;
  color: grey;
}

.title {
  cursor: pointer;
  font-size: 28px;
  font-weight: bold;
}

.title:hover {
  text-decoration: underline;
}

.post-link {
  color: black;
}

.post-link:hover {
  color: blue;
}
</style>

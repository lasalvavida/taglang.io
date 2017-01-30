<template>
  <div>
    <div class="date"> {{post.date.toDateString()}} </div>
    <div class="title"> {{post.title}} </div>
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
      loadComponents: []
    }
  },
  props: ['post'],
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
  font-size: 28px;
  font-weight: bold;
}
</style>

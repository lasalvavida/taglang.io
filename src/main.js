// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import About from './components/About'
import App from './App'
import Blog from './components/Blog'
import BlogPageView from './components/BlogPageView'
import BlogPostView from './components/BlogPostView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '/about',
        component: About
      }, {
        path: '/blog',
        component: Blog,
        children: [
          {
            path: '/blog/page/:page',
            component: BlogPageView,
            props: (route) => ({ page: parseInt(route.params.page) })
          },
          {
            path: '/blog/post/:id',
            component: BlogPostView,
            props: true
          }
        ],
        redirect: '/blog/page/0'
      }
    ],
    redirect: '/blog'
  }
]

const router = new VueRouter({
  routes
})

/* eslint-disable no-new */
new Vue({
  router
}).$mount('#app')

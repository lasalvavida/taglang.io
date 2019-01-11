---
title: Migration to VuePress
date: 2019-01-11 0:00.00
---

# {{ $page.frontmatter.title }}

**{{ new Date($page.frontmatter.date).toDateString() }}**

Happy new year! As they say, new year, new blog.

When I started doing this (about 2+ years ago), the focus was on content related to my thesis, but more importantly on how valuable interactivity is as a teaching tool.

As such, not just any old blogging framework would do. I wanted complex, dynamic JavaScript content embedded within posts. Eventually I settled on the following technology stack:

* PHP + SQL backend for getting post metadata
* Posts as Vue.js components with Webpack for bundling and code-splitting

This served me well for a while, but it had a few drawbacks:

* Having a database dependency makes it harder to test changes. It's not the worst thing in the world, but it is just one more barrier to getting set up and easily adding new content.
* It's a nightmare for SEO. Because each post is effectively an individual SPA that is loaded dynamically into the page at runtime, web crawlers have a hard time indexing the content.
  * This is also a problem for users that run with JS disabled by default.
* Writing posts that are mostly text without a lot of interactive content in HTML is kind of a pain (vs. Markdown for example).

I found myself putting off writing often, because I was busy worrying about these things. I'd like to change that this year and to further this goal, I started exploring some options in the last few months of 2018 to try and address these problems.

### Trying out Nuxt.js

Eventually, I concluded that I was looking for a static site generator with support for embedding javascript content that I would still be able to use with hot-reloading for development.

*(If you work on browser JavaScript at all and you're not doing this right now, I highly recommend checking out
[vue-cli](https://github.com/vuejs/vue-cli)
to set up a dead-simple Vue.js sandbox with hot-reloading. Once you do, there's no going back.)*

[Nuxt.js](https://nuxtjs.org/) is an awesome project. It lets you build Vue projects as a server that pre-renders your pages and hosts them. I wouldn't be able to do this with my current hosting, but Nuxt also supports building and exporting a static site. This is fine as long as you don't need to respond dynamically to HTTP requests (i.e. your site is a static site).

I think Nuxt is probably great if you are using it as a service (what it is designed for), but I had some trouble getting the built static site to work properly for my ends.

Nuxt requires some plugin integration for certain Vue plugins to work, and it isn't always clear what needs to be done from a user's perspective. It seems like a lot of this is on the plugin maintainer's side, but smaller plugin maintainers may not have the time/resources to make sure that their plugin works properly with Nuxt.

For example, [bootstrap-vue](https://bootstrap-vue.js.org/) directly supports Nuxt builds, and works pretty much out of the box. However, [vue-awesome](https://bootstrap-vue.js.org/), which I use here for [Font Awesome](https://fontawesome.com/) integration seems to have some
[problems](https://github.com/nuxt/nuxt.js/issues/174).

**Update: I was working on this a few months ago. I have been informed that vue-awesome integration has since been fixed, along with a helpful [codesandbox example](https://codesandbox.io/s/github/manniL/nuxt-vue-awesome-example/tree/master/).**

> [@TheAlexLichter](https://twitter.com/TheAlexLichter) Issues w/ vue-awesome are gone (you can use `build.transpile` for it) and such things are usually an exception.

I also had difficulty figuring out a clean way to do page navigation in a way that would be generated from the posts dynamically and still work when exported as a static site. I'm sure there is probably a way, but this setback, coupled with the amount of work I found myself needing to do in order to integrate external plugins and libraries (that would surely break at some point), led me to look elsewhere.

### Enter VuePress

[VuePress](https://vuepress.vuejs.org/) is still a fairly young project and is still in alpha. However, it is developed and maintained by the phenomenal
[Evan You](https://twitter.com/youyuxi)
who is also the creator of Vue.js.

In short, VuePress is a static site generator for Vue pages that checks most of my boxes.

* :heavy_check_mark: Development environment with hot-reloading
* :heavy_check_mark: Just works (more or less) without micro-managing webpack too much
* :heavy_check_mark: Built in support for markdown
* :question: Statically build site navigation in an easily maintainable way

As a bonus, it also comes with built in integrated search - super cool!

### Migrating the Site

I was able to very easily move most of the content from the old site as-is, and have it work out of the box with VuePress with one little tweak to WebPack.

VuePress provides WebPack configuration via `.vuepress/config.js`.

```javascript
module.exports = {
    themeConfig: {
        nav: [{ text: 'Blog', link: '/' },
              { text: 'About Me', link: '/about/' }]
    },
    configureWebpack: (config, isServer) => {
        if (!isServer) {
            config.node.process = true
            config.node.global = true
        }
    }
}
```

Some of my node library dependencies needed `process` and `global` to be defined in order to get transpiled for the browser properly.

Then, I started replacing HTML with markdown where possible and cleaning up some of the hacky, custom styling I had been doing in favor of using Bootstrap components.

I still have some work do here, but overall I'm very happy with the results.

### Building Site Navigation

This part was a little trickier. One of the pain points with my old site architecture is that the post metadata was separated from the posts themselves.

Ideally, the posts should be completely self-contained, metadata and all, and the static site generator should be able to get and use that information in an intelligent way.

I ended up doing this using 
[VuePress Front Matter](https://vuepress.vuejs.org/guide/markdown.html#front-matter).
VuePress lets you specify YAML front matter in your markdown (if you've used
[Jekyll](https://jekyllrb.com/),
you may be familiar with this concept).

In short, it creates some properties that you can access elsewhere as `frontmatter` on pages in the global `this.$site.pages` in your Vue components.

```yaml
---
title: My Awesome Post
date: 2019-01-11 0:00.00
---
```

And so, it's dead simple to get all blog posts and sort them by date, for example.

```javascript
this.$site.pages
    .filter(x => x.path.startsWith('/blog/'))
    .sort((x, y) => new Date(y.frontmatter.date) - new Date(x.frontmatter.date))
```

Doing this to locate the previous/next page is done at site build time, so all I have to do is include my navigation component in the posts, and everything else just works.

If you're curious and want to check it out, all of the site code is available on [GitHub](https://github.com/lasalvavida/taglang.io).

<BlogPostNav/>

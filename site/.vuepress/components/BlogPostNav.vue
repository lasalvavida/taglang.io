<template>
<div>
    <b-container>
        <b-row align-h="between">
            <b-col>
                <router-link v-if="nav.prev !== undefined" :to="nav.prev.path">
                    <v-icon name="angle-left"/>
                    {{ nav.prev.frontmatter.title }}
                </router-link>
            </b-col>
            <b-col>
                <router-link v-if="nav.next !== undefined" :to="nav.next.path">
                    {{ nav.next.frontmatter.title }}
                    <v-icon name="angle-right"/>
                </router-link>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
import '../../node_modules/vue-awesome/icons/angle-left'
import '../../node_modules/vue-awesome/icons/angle-right'

export default {
    computed: {
        nav () {
            let found = false
            let next, prev;
            for (let page of this.$site.pages
                    .filter(x => x.path.startsWith('/blog/'))
                    .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))) {
                if (page.key === this.$page.key) {
                    found = true
                } else if (found) {
                    next = page
                    break;
                } else {
                    prev = page
                }
            }
            return {
                next: next,
                prev: prev
            }
        }
    }
}
</script>
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Icon from '../node_modules/vue-awesome/components/Icon'

export default({
    Vue,
    options,
    router,
    siteData
}) => {
    Vue.use(BootstrapVue)
    Vue.component('v-icon', Icon)
}

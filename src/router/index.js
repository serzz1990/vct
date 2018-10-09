import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    // mode: 'history',
    // base: process.env.NODE_ENV === 'production' ? '/' : '/',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (to.name === 'vote') {
                return { selector: '#vote' }
            } else {
                return { x: 0, y: 0 }
            }
        }
    },
    routes: [
        {
            path: '/',
            name: 'main',
            meta: {},
            component: () => import('@/views/main')
        },
        {
            path: '*',
            redirect: {
                name: 'main'
            }
        }
    ]
})

// TODO: нужно менять позицию курсора и при первом входе
// let first = true
// router.afterEach((to, from) => {
//     if (to.path.indexOf('vote') > -1) {
//         router.options.scrollBehavior(to, from, false)
//         first = false
//     }
// })

export default router


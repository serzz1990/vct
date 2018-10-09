import Vue from 'vue'
const HOSTPROD = 'https://production.com/'
const HOST = (process.env.NODE_ENV === 'production') ? HOSTPROD : '/'

export default {
    GET (url, params, options) {
        return this.request(url, 'get', params, options)
    },
    POST (url, params, options) {
        return this.request(url, 'post', params, options)
    },
    DELETE (url, params, options) {
        return this.request(url, 'delete', params, options)
    },
    request (url, method = 'get', params = {}, options = {}) {
        let args = [
            HOST + url
        ]

        if (method === 'get') {
            options.params = params
        } else if (method === 'post') {
            args.push(params)
        } else if (method === 'delete') {
            options.body = params
        }

        if (!options.headers) {
            options.headers = {}
        }

        options.credentials = true

        args.push(options)

        return Vue.http[method](...args).then(res => res.json())
    }
}

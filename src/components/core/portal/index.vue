<script>
    // https://github.com/vuematerial/vue-material/blob/dev/src/components/MdPortal/MdPortal.js
    import Vue from 'vue'
    import raf from 'raf'
    export default {
        name: 'portal',
        abstract: true,
        props: {
            attachToParent: Boolean,
            target: {
                type: null,
                validator (value) {
                    if (HTMLElement && value && value instanceof HTMLElement) {
                        return true
                    }
                    Vue.util.warn('The target-el prop is invalid. You should pass a valid HTMLElement.', this)
                    return false
                }
            }
        },
        data () {
            return {
                leaveTimeout: null,
                originalParentEl: null
            }
        },
        computed: {
            transitionName () {
                const childrenComponent = this._vnode.componentOptions && this._vnode.componentOptions.children[0]
                if (childrenComponent) {
                    const transition = childrenComponent.data.transition
                    if (transition) {
                        return transition.name
                    } else {
                        const transition = childrenComponent.componentOptions.propsData.name
                        if (transition) {
                            return transition
                        }
                    }
                }
                return 'v'
            },
            leaveClass () {
                return this.transitionName + '-leave'
            },
            leaveActiveClass () {
                return this.transitionName + '-leave-active'
            },
            leaveToClass () {
                return this.transitionName + '-leave-to'
            }
        },
        watch: {
            target (newTarget, oldTarget) {
                this.changeParentEl(newTarget)
                if (oldTarget) {
                    this.$forceUpdate()
                }
            }
        },
        methods: {
            changeParentEl (newTarget) {
                newTarget && newTarget.appendChild(this.$el)
            },
            initDestroy (manualCall) {
                let el = this.$el
                if (manualCall && this.$el.nodeType === Node.COMMENT_NODE) {
                    el = this.$vnode.elm
                }
                el.classList.add(this.leaveClass)
                el.classList.add(this.leaveActiveClass)
                this.$nextTick().then(() => {
                    el.classList.add(this.leaveToClass)
                    clearTimeout(this.leaveTimeout)
                    this.leaveTimeout = setTimeout(() => {
                        this.destroyElement(el)
                    }, this.getTransitionDuration(el))
                })
            },
            killGhostElement (el) {
                if (el.parentNode) {
                    this.changeParentEl(this.originalParentEl)
                    this.$options._parentElm = this.originalParentEl
                    el.parentNode.removeChild(el)
                }
            },
            getTransitionDuration (el) {
                const duration = window.getComputedStyle(el).transitionDuration
                const num = parseFloat(duration, 10)
                let unit = duration.match(/m?s/)
                if (unit) {
                    unit = unit[0]
                }
                if (unit === 's') {
                    return num * 1000
                }
                if (unit === 'ms') {
                    return num
                }
                return 0
            },
            destroyElement (el) {
                raf(() => {
                    el.classList.remove(this.leaveClass)
                    el.classList.remove(this.leaveActiveClass)
                    el.classList.remove(this.leaveToClass)
                    this.$emit('md-destroy')
                    this.killGhostElement(el)
                })
            }
        },
        mounted () {
            if (!this.originalParentEl) {
                this.originalParentEl = this.$el.parentNode
                this.$emit('initial-parent', this.$el.parentNode)
            }
            if (this.attachToParent && this.$el.parentNode.parentNode) {
                this.changeParentEl(this.$el.parentNode.parentNode)
            } else if (document) {
                this.changeParentEl(this.target || document.body)
            }
        },
        beforeDestroy () {
            if (this.$el.classList) {
                this.initDestroy()
            } else {
                this.killGhostElement(this.$el)
            }
        },
        render () {
            const defaultSlot = this.$slots.default
            if (defaultSlot && defaultSlot[0]) {
                return defaultSlot[0]
            }
        }
    }
</script>
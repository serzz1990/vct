<script>
    import breakpoints from './breakpoints.json'

    export default {
        abstract: true,
        props: {
            /**
             * Начальное состояние компонента
             * Если true то компонент не учавствует в серверном рендеринге
             */
            hidden: {
                type: Boolean,
                default: false
            },
            /**
             * Значение брекпоинта
             * Принимается как числовое значение [xs, sm, md, l], так и числовое [400, 1200, ...]
             */
            breakpoint: [String, Number],
            /**
             * Правило брекпоинта
             * Если true, то правило отображения работает от значения брекпоинта и выше,
             * если false, то до значания брекпоинта
             */
            over: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                visible: true
            }
        },
        computed: {
            size () {
                if (typeof this.breakpoint === 'number') {
                    return this.breakpoint
                } else if (typeof this.breakpoint === 'string') {
                    if (breakpoints[this.breakpoint]) {
                        return breakpoints[this.breakpoint]
                    } else if (this.isNumber(this.breakpoint)) {
                        return +this.breakpoint
                    }
                }
                return 0
            }
        },
        watch: {
            visible () {
                this.$forceUpdate()
            }
        },
        methods: {
            isNumber (number) {
                let val = +number
                /* eslint-disable */
                return val == number
            },
            update () {
                if (this.breakpoint) {
                    const width = window.innerWidth
                    if ((this.over && width >= this.size) || (!this.over && width < this.size)) {
                        this.visible = true
                    } else {
                        this.visible = false
                    }
                }
            }
        },
        mounted () {
            this.update()
            window.addEventListener('resize', this.update)
        },
        created () {
            if (this.hidden) {
                this.visible = false
            }
        },
        beforeDestroy () {
            window.removeEventListener('resize', this.update)
        },
        render () {
            const defaultSlot = this.$slots.default

            if (defaultSlot && defaultSlot[0] && this.visible) {
                return defaultSlot[0]
            }
        }
    }
</script>

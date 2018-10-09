<template>
    <span class="bi-ripple" v-if="mounted || !disabled">
        <span class="bi-ripple__pointer" :class="classes" :style="styles" ref="ripple"></span>
    </span>
</template>


<script>
    const addEvent = (target, type, handler) => {
        if (type === 'start') {
            target.addEventListener('mousedown', handler)
            target.addEventListener('touchstart', handler)
        } else {
            target.addEventListener('mouseup', handler)
            target.addEventListener('touchend', handler)
        }
    }
    const removeEvent = (target, type, handler) => {
        if (type === 'start') {
            target.removeEventListener('mousedown', handler)
            target.removeEventListener('touchstart', handler)
        } else {
            target.removeEventListener('mouseup', handler)
            target.removeEventListener('touchend', handler)
        }
    }
    export default {
        name: 'bi-ripple',
        props: {
            biDisabled: Boolean
        },
        data: () => ({
            mounted: false,
            rippleElement: null,
            parentElement: null,
            parentDimensions: {
                width: null,
                height: null,
                top: null,
                left: null
            },
            awaitingComplete: false,
            hasCompleted: false,
            fadeOut: false,
            active: false
        }),
        computed: {
            classes () {
                return {
                    'bi-ripple__pointer--fadeout': this.fadeOut,
                    'bi-ripple__pointer--active': this.active
                }
            },
            styles () {
                return {
                    width: this.parentDimensions.width,
                    height: this.parentDimensions.height,
                    top: this.parentDimensions.top,
                    left: this.parentDimensions.left
                }
            },
            disabled () {
                return this.biDisabled
            }
        },
        watch: {
            disabled (disabled) {
                if (!disabled) {
                    this.init()
                } else {
                    this.destroy()
                }
            }
        },
        methods: {
            checkAvailablePositions (element) {
                const availablePositions = ['relative', 'absolute', 'fixed']

                return availablePositions.indexOf(getComputedStyle(element).position) > -1
            },

            getClosestPositionedParent (element) {
                const parent = element && element.parentNode

                if (!parent || parent.tagName.toLowerCase() === 'body') {
                    return false
                }

                if (this.checkAvailablePositions(element)) {
                    return element
                }

                return this.getClosestPositionedParent(parent)
            },

            getParentSize () {
                const parent = this.parentElement
                return Math.round(Math.max(parent.offsetWidth, parent.offsetHeight)) + 'px'
            },

            getClickPosition (event) {
                if (this.$refs.ripple) {
                    const rect = this.parentElement.getBoundingClientRect()

                    let top = event.pageY
                    let left = event.pageX

                    if (event.type === 'touchstart') {
                        top = event.changedTouches[0].pageY
                        left = event.changedTouches[0].pageX
                    }

                    return {
                        top: top - rect.top - this.$refs.ripple.offsetHeight / 2 - document.scrollingElement.scrollTop + 'px',
                        left: left - rect.left - this.$refs.ripple.offsetWidth / 2 - document.scrollingElement.scrollLeft + 'px'
                    }
                }
                return false
            },

            setDimensions () {
                const size = this.getParentSize()

                this.parentDimensions.width = size
                this.parentDimensions.height = size
            },

            setPositions (event) {
                const positions = this.getClickPosition(event)

                if (positions) {
                    this.parentDimensions.top = positions.top
                    this.parentDimensions.left = positions.left
                }
            },

            clearState () {
                this.active = false
                this.fadeOut = false
                this.hasCompleted = false
                this.setDimensions()

                window.clearTimeout(this.awaitingComplete)

                removeEvent(document.body, 'end', this.endRipple)
            },

            startRipple (event) {
                if (event.type === 'touchstart') {
                    this.previous.push('touch')
                } else {
                    this.previous.push('mouse')
                }

                this.previous = this.previous.splice(this.previous.length - 2, this.previous.length)

                if (this.previous.length >= 2 && this.previous[1] === 'touch' && this.previous[0] === 'mouse') {
                    return
                }

                this.clearState()

                this.awaitingComplete = window.setTimeout(() => {
                    this.hasCompleted = true
                }, 400)

                addEvent(document.body, 'end', this.endRipple)

                this.$nextTick(() => {
                    this.setPositions(event)
                    this.active = true
                })
            },

            endRipple () {
                if (this.hasCompleted) {
                    this.fadeOut = true
                } else {
                    this.awaitingComplete = window.setTimeout(() => {
                        this.fadeOut = true
                    }, 200)
                }

                removeEvent(document.body, 'end', this.endRipple)
            },

            registerTriggerEvent () {
                addEvent(this.parentElement, 'start', this.startRipple)
            },

            unregisterTriggerEvent () {
                if (this.parentElement) {
                    removeEvent(this.parentElement, 'start', this.startRipple)
                }
            },

            init () {
                this.rippleElement = this.$el
                this.parentElement = this.getClosestPositionedParent(this.$el.parentNode)
                this.previous = ['mouse']
                if (this.parentElement) {
                    this.rippleElement.parentNode.removeChild(this.rippleElement)
                    if (this.parentElement.querySelectorAll('.bi-ripple').length > 0) {
                        this.$destroy()
                    } else {
                        this.parentElement.appendChild(this.rippleElement)
                        this.registerTriggerEvent()
                        this.setDimensions()
                    }
                } else {
                    this.$destroy()
                }
            },

            destroy () {
                if (this.rippleElement && this.rippleElement.parentNode) {
                    this.unregisterTriggerEvent()
                    this.rippleElement.parentNode.removeChild(this.rippleElement)
                }
            }
        },

        mounted () {
            window.setTimeout(() => {
                if (!this.disabled) {
                    this.init()
                } else {
                    this.destroy()
                }
                this.$nextTick(() => {
                    this.mounted = true
                })
            }, 100)
        },

        beforeDestroy () {
            this.destroy()
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus">
    /* Transitions  */
    $swift-ease-out-duration = .4s
    $swift-ease-out-timing-function = cubic-bezier(.25, .8, .25, 1)
    $swift-ease-out = all $swift-ease-out-duration $swift-ease-out-timing-function

    $swift-ease-in-duration = .3s
    $swift-ease-in-timing-function = cubic-bezier(.55, 0, .55, .2)
    $swift-ease-in = all $swift-ease-in-duration $swift-ease-in-timing-function

    .bi-ripple {
        $block = selector()

        display block
        pointer-events none
        overflow hidden
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        -webkit-mask-image radial-gradient(circle, white 100%, black 100%)
        -webkit-tap-highlight-color transparent
        -webkit-touch-callout none
        border-radius inherit

        transition $swift-ease-in

        &__pointer {
            $pointer = selector()
            display block
            position absolute
            background-color currentColor
            border-radius 50%
            opacity .2
            transform scale(0) translateZ(0)
            transition none
            will-change background-color, opacity, transform, width, height, top, left

            &--active {
                animation biripple 1s cubic-bezier(.25, .8, .25, 1) forwards

                &{$pointer}--fadeout {
                    opacity 0 !important
                    transition $swift-ease-out
                    transition-duration .6s
                }
            }
        }


    }

    @keyframes biripple {
        to {
            transform scale(2.2) translateZ(0)
        }
    }
</style>

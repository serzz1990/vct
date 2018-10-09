<template>
    <div class="ui-accordion" :class="{'is-open': isOpen}">
        <transition name="accordion-toggle" @enter="onEnter" @leave="onLeave" @after-enter="onEnterTo">
            <div class="ui-accordion__content" ref="content" v-if="isOpen">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'ui-accordion',
        props: {
            value: {
                type: Boolean,
                default: undefined
            },
            opened: Boolean
        },
        data () {
            return {
                innerValue: false
            }
        },
        computed: {
            useModel () {
                return typeof this.value !== 'undefined'
            },
            isOpen () {
                return this.useModel ? this.value : this.innerValue
            }
        },
        methods: {
            init () {
                if (!this.useModel) {
                    this.innerValue = !!this.opened
                }
            },
            onToggle () {
                let value

                if (this.useModel) {
                    value = !this.value
                } else {
                    this.innerValue = !this.innerValue
                    value = this.innerValue
                }

                this.$emit('change', value)
                this.$emit('input', value)
            },
            onEnter () {
                this.$refs.content.style.height = this.$refs.content.scrollHeight + 'px'
            },
            onEnterTo () {
                this.$refs.content.style.height = null
            },
            onLeave () {
                this.$refs.content.style.height = this.$refs.content.scrollHeight + 'px'
            }
        },
        created () {
            this.init()
        },
        watch: {
            opened () {
                this.init()
            }
        }
    }
</script>


<style rel="stylesheet/stylus" lang="stylus">
    .ui-accordion {
        transition margin-top 0.4s

        &__content {
            &.accordion-toggle-leave-active ,
            &.accordion-toggle-enter-active {
                transition .25s opacity, .25s height ease-in-out
                overflow hidden
            }

            &.accordion-toggle-enter-active,
            &.accordion-toggle-leave-to {
                opacity 0
                height 0
            }

            &.accordion-toggle-enter-to {
                opacity 1
            }
            &.accordion-toggle-leave-to {
                height 0!important
            }
        }
    }
</style>

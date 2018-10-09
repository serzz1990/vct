<template>
    <div class="ui-select-wrap">
        <div class="ui-select" @click="onToggle" :class="classes">
            <div class="ui-select__select">
                <div class="ui-select__item">
                    <select-item v-if="selectItem" selected :long="selectItem.name.length > 25">
                        Отделение
                        <template slot="desc">{{selectItem.name}}</template>
                    </select-item>
                    <select-item v-else>{{placeholder}}</select-item>
                </div>
                <div class="ui-select__pointer">
                    <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0L4 4L8 0" transform="translate(0.5 1)" stroke="#0049AC"/>
                    </svg>
                </div>
            </div>

            <transition name="list">
                <select-list v-bind="{options, value}" v-if="opened">
                    <select-item slot-scope="{item, index}" @click.native="onSelect(index)" :long="item.name.length > 25">
                        {{item.name}}
                        <template slot="desc">{{item.address}}</template>
                    </select-item>
                </select-list>
            </transition>
        </div>
    </div>
</template>

<script>
    import selectList from './list.vue'
    import selectItem from './item.vue'

    export default {
        name: 'ui-select',
        props: {
            value: {
                type: [String, Boolean, Object, Number]
            },
            options: {
                type: Array,
                default: () => []
            },
            placeholder: {
                type: String,
                default: 'Выберите'
            },
            required: Boolean,
            disabled: Boolean
        },
        data () {
            return {
                opened: false
            }
        },
        components: {
            selectList,
            selectItem
        },
        computed: {
            selectItem () {
                return typeof this.value === 'number' ? this.options[this.value] : null
            },
            classes () {
                return {
                    'opened': this.opened,
                    'selected': this.selectItem
                }
            }
        },
        methods: {
            onSelect (index) {
                this.$emit('input', index)
            },
            onToggle () {
                this.opened = !this.opened
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .ui-select-wrap {
        position relative
        height 5rem
        width 100%
        min-width 26rem
        box-sizing border-box
        z-index 1
    }
    .ui-select {
        border 1px solid $gray
        border-radius 2px
        box-sizing border-box
        width 100%
        position absolute
        top 0
        left 0

        &.opened,
        &.selected {
            border 1px solid $primary-yellow
        }

        &__select {
            display flex
            user-select none
            height 4.8rem
            cursor pointer
        }
        &__item {
            flex 1 1
        }
        &__pointer {
            display flex
            align-items center
            justify-content center
            width 3.7rem
            transition transform 0.3s
            transform-origin center
        }
        &.opened {
            box-shadow: 0 4px 10px rgba(247, 183, 10, 0.2)
        }
        &.opened &__pointer {
            transform rotate(-180deg)
        }

        .list-enter-active,
        .list-leave-active {
            transition height 0.25s ease
        }
        .list-enter,
        .list-leave-to {
            height 0
        }
    }
</style>
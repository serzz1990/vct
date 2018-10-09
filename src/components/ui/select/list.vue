<template>
    <div class="ui-select-list">
        <div class="ui-select-list__item" v-for="(item, index) in options" :key="index" :class="{'focus': value === index}">
            <slot :item="item" :index="index"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            options: Array,
            value: [Number, String]
        }
    }
</script>

<style lang="stylus" scoped>
    .ui-select-list {
        border-top 1px solid rgba($primary-blue, 0.2)
        background-color #fff
        height 24rem
        overflow auto

        &__item {
            border-top 1px solid rgba($primary-blue, 0.2)
            transition 0.3s background-color
            min-height 6rem
            display flex

            &.focus,
            &:hover {
                background-color rgba($primary-blue, 0.05)
            }
            &:first-child {
                border-top 0 none
            }
            /deep/ > div {
                flex 1 1
            }
        }
    }
</style>
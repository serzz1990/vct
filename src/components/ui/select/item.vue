<template>
    <div class="ui-select-item" :class="{'selected': selected, 'long': long}">
        <div class="ui-select-item__title"><slot></slot></div>
        <div class="ui-select-item__desc"><slot name="desc"></slot></div>
    </div>
</template>

<script>
    export default {
        props: {
            selected: Boolean,
            long: Boolean
        }
    }
</script>

<style lang="stylus" scoped>
    .ui-select-item {
        display flex
        flex-direction column
        padding 0 1.3rem
        cursor pointer
        min-height 5rem
        justify-content center

        &__title {
            font-size 1.6rem
            line-height 2.1rem
        }
        &__desc {
            font-size 1rem
            line-height 1.3rem
            color rgba(#000000, 0.5)
        }
        &.long &__desc {
            font-size 1rem
        }
        /* &.long &__title {
            font-size 1.4rem
        } */
        &.selected.long &__desc {
            font-size 1.2rem
            +layout-xs() {
                font-size 1rem
                line-height 1.4rem
                padding-top 0.5rem
            }
        }
        &.selected &__title {
            padding-top 0.2rem
            line-height 1.5rem
            font-size 1.2rem
            color rgba(#000000, 0.3)
        }
        &.selected &__desc {
            font-size 1.6rem
            line-height 2.1rem
            color $primary-blue
        }
    }
</style>
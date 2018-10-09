<template>
    <portal v-if="global">
        <transition name="ui-overlay-fade">
            <div class="ui-overlay is-fixed" v-if="show" :class="{'ui-overlay--white': isWhite}"></div>
        </transition>
    </portal>

    <transition v-else name="ui-overlay-fade">
        <div class="ui-overlay" v-if="show" :class="{'ui-overlay--white': isWhite}"></div>
    </transition>
</template>


<script>
    import Portal from '@/components/core/portal'

    export default {
        name: 'ui-overlay',
        props: {
            show: Boolean,
            global: Boolean,
            isWhite: Boolean
        },
        components: {
            Portal
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .ui-overlay {
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        z-index 110
        overflow hidden
        background rgba(255, 255, 255, .5)
        transition opacity .35s ease-in
        will-change opacity

        &--white {
            background $white
        }

        &.is-fixed {
            position fixed
        }

        &.ui-overlay-fade-enter,
        &.ui-overlay-fade-leave-to {
            opacity 0
        }
    }
</style>

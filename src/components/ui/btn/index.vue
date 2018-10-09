<template>
    <component :is="tag" :disabled="disabled" class="ui-btn" :type="type" :class="classes">
        <slot></slot>
    </component>
</template>
<script>
    export default {
        props: {
            type: String,
            disabled: Boolean,
            light: Boolean,
            white: Boolean,
            small: Boolean
        },
        computed: {
            tag() {
                return this.type ? 'button' : 'a'
            },
            classes() {
                return {
                    disabled: this.disabled,
                    light: this.light,
                    white: this.white,
                    small: this.small
                }
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .ui-btn {
        height 6rem
        border: none;
        outline: none;
        color: #fff;
        cursor: pointer;
        line-height: 6rem;
        font-size: 1.6rem;
        user-select: none;
        text-align: center;
        border-radius: 2px;
        display: inline-block;
        text-decoration: none;
        padding: 0 1.7rem;
        background: $primary
        font-weight $font-regular
        transition 0.3s background-color ease

        &.small {
            font-size 1.4rem
            height 4.8rem
            line-height 4.8rem
        }

        &:hover, &:focus {
            background: $primary-darken
        }

        &:focus {
            box-shadow: 0 0.3rem 0.9rem rgba(0, 0, 0, 0.25);
        }

        &:active {
            box-shadow: none;
            background: $primary-darken-2
        }

        &.light {
            background-color transparent
            color rgba(#000, 0.6)
            border 1px solid rgba(#000, 0.4)
            transition border-color 0.3s
        }

        &.light:active,
        &.light:hover, &.light:focus {
            background transparent
            border-color rgba(#000, 0.6)
        }

        &.white {
            background-color $white
            color rgba(#000, 0.6)
            border 1px solid rgba(#000, 0.4)
            transition border-color 0.3s
        }

        &.white:active,
        &.white:hover, &.white:focus {
            background: $white
            border-color rgba(#000, 0.6)
        }



        &[disabled] {
            opacity: 0.5;
            pointer-events: none;
        }

        &[disabled].theme-blue {
            opacity: 1;
            background-color: $gray;
            box-shadow: none;
        }

        /deep/ svg {
            margin-left: 0.5rem;
        }
    }
</style>

<template>
    <div class="md-checkbox" :class="checkClasses">
        <div class="md-checkbox-container" @click="toggleCheck">
            <input type="checkbox" :checked="isSelected" v-bind="{id, name, disabled, required}"/>
        </div>

        <component :is="labelTag" :for="id" class="md-checkbox-label" v-if="$slots.default">
            <slot />
        </component>
    </div>
</template>

<script>
    export default {
        name: 'ui-checkbox',
        props: {
            value: {
                type: [String, Boolean, Object, Number]
            },
            id: {
                type: String,
                default: () => 'ui-checkbox-' + Math.random().toString(36).slice(4)
            },
            name: [String, Number],
            required: Boolean,
            disabled: Boolean,
            disabledLabel: Boolean
        },
        model: {
            prop: 'value',
            event: 'input'
        },
        computed: {
            isSelected () {
                return !!this.value
            },
            labelTag () {
                return this.disabledLabel ? 'div' : 'label'
            },
            checkClasses () {
                return {
                    'is-checked': this.isSelected,
                    'is-disabled': this.disabled,
                    'is-required': this.required
                }
            }
        },
        methods: {
            handleStringCheckbox () {
                if (!this.isSelected) {
                    this.$emit('input', this.value)
                } else {
                    this.$emit('input', null)
                }
            },
            handleBooleanCheckbox () {
                this.$emit('input', !this.model)
            },
            toggleCheck () {
                if (!this.disabled) {
                    this.$emit('input', !this.isSelected)
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    $md-checkbox-size = 16px
    $md-checkbox-touch-size = 48px
    $color-primary = #0049AC

    .md-checkbox {
        width: auto;
        display: flex;
        position: relative;
        user-select none
        max-width 41rem
        font-size 1.6rem
        line-height 2.1rem

        +layout-sm() {
            font-size 1.4rem
            line-height 1.8rem
        }

        &:not(.is-disabled) {
            cursor: pointer;
            .md-checkbox-label {
                cursor: pointer;
            }
        }

        &:hover {
            .md-checkbox-label {
                color rgba(#000, 0.8)
            }
            .md-checkbox-container {
                border-color rgba(0, 0, 0, 0.4)
            }
        }

        .md-checkbox-container {
            width: $md-checkbox-size;
            min-width: $md-checkbox-size;
            height: $md-checkbox-size;
            position: relative;
            box-sizing border-box
            border-radius 2px
            border 1px solid rgba(0, 0, 0, 0.2)

            transition: .4s cubic-bezier(.25,.8,.25,1);
            overflow hidden

            &:focus {
                outline: none;
            }
            &:before,
            &:after {
                position: absolute;
                transition: $md-transition-drop;
                content: " ";
            }
            &:before {
                width: $md-checkbox-touch-size;
                height: $md-checkbox-touch-size;
                top: 50%;
                left: 50%;
                z-index: 11;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            &:after {
                width: 5px;
                height: 7px;
                top: 3px;
                left: 5px;
                z-index: 12;
                border: 2px solid $primary;
                border-top: 0;
                border-left: 0;
                opacity: 0;
                transform: rotate(45deg) scale3D(.15, .15, 1);
            }
            input {
                position: absolute;
                left: -100px;
            }
        }
        .md-checkbox-label {
            min-height: $md-checkbox-size
            padding-left: 10px
            display flex
            position: relative
            transition color .2s linear
            flex-direction column
            font-size 1.2rem
            line-height 1.5rem
            justify-content center
            color rgba(#000, 0.7)

            a {
                text-decoration underline
                display inline

                &:hover {
                    text-decoration-color #B72242
                }
            }
        }
        & + & {
            margin-top 15px
        }
    }
    .md-checkbox.is-checked {
        .md-checkbox-container {
            background-color: $white
            border-color: rgba(0, 0, 0, 0.2)

            &:after {
                opacity: 1;
                transform: rotate(45deg) scale3D(1,1,1);
                transition: .4s cubic-bezier(.25,.8,.25,1);
            }
        }
    }
    .md-checkbox.is-disabled.is-checked {
        .md-checkbox-container {
            border-color: transparent !important;
        }
    }
    .md-checkbox.is-required {
        label:after {
            position: absolute;
            top: 2px;
            right: 0;
            transform: translateX(calc(100% + 2px));
            content: "*";
            line-height: 1em;
            vertical-align: top;
        }
    }
</style>

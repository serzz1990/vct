<template>
    <div class="ui-input" :class="classes" tabindex="1" @focus="onFocusWrap">
        <date-picker v-if="type === 'date'"
                     v-bind="{value, format, disabledDates, openDate}"
                     input-class="ui-input__input"
                     :language="ru"
                     initialView="year"
                     @input="onInput"
                     @selected="onInput"
                     @opened="onFocus"
                     @closed="onBlur"
                     @cleared="onBlur"

        >
        </date-picker>

        <template v-else>
            <input v-if="mask" class="ui-input__input"
                   ref="input"
                   v-mask="mask"
                   :value="value"
                   :placeholder="placeholderInput"
                   @input="onInput"
                   @blur="onBlur"
                   @focus="onFocus"
                   @keydown="onKeydown"
                   @keyup="onKeyup"
                   :type="type"
                   :maxlength="maxlength"
            />
            <input v-else class="ui-input__input"
                   ref="input"
                   :value="value"
                   :placeholder="placeholderInput"
                   @input="onInput"
                   @blur="onBlur"
                   @focus="onFocus"
                   @keydown="onKeydown"
                   @keyup="onKeyup"
                   :type="type"
                   :tabindex="[disabled ? '-1' : false]"
                   :maxlength="maxlength"
            />
        </template>

        <span class="ui-input__icon">
            <slot></slot>
        </span>

        <span class="ui-input__status" v-if="success"></span>
        <span class="ui-input__error" v-if="error && !isFocused">
            <span v-if="errorText">{{ errorText }}</span>
            <span v-else>Поле обязательное для заполнения</span>
        </span>
        <span class="ui-input__placeholder" v-if="placeholder">{{placeholder}}</span>
    </div>
</template>
<script>
    // mask
    // https://vuejs-tips.github.io/vue-the-mask/

    // Datepicker
    // https://github.com/charliekassel/vuejs-datepicker?ref=madewithvuejs.com#available-props
    // https://docs.vcalendar.io/#installation

    import {mask} from 'vue-the-mask'
    import DatePicker from 'vuejs-datepicker'
    import {ru} from 'vuejs-datepicker/dist/locale'

    export default {
        components: {
            DatePicker
        },
        directives: {
            mask: mask
        },
        props: {
            value: [String, Number, Object, Array, Date],
            debounce: {
                type: Number,
                default: 1E2
            },
            type: {
                type: String,
                default: 'text'
            },
            format: String,
            mask: [String, Array, Object],
            placeholderInput: String,
            errorText: String,
            disabled: Boolean,
            required: Boolean,
            regexp: String,
            maxlength:  {
                type: [Number, String],
                default: 500
            },
            disabledDates: Object,
            openDate: [Date, String],
            name: String,
            placeholder: String,
            readonly: Boolean
        },
        data () {
            return {
                ru,
                success: false,
                error: false,
                rexp: null,
                isFocused: false,
                timeout: 0,
                touched: false
            }
        },
        methods: {
            onKeydown (e) {
                if (e.key.length === 1 && this.rexp && !this.rexp.test(this.value + e.key)) {
                    this.error = true
                    this.$emit('invalid')
                }

                this.$emit('keydown', e)
            },
            onKeyup () {
                setTimeout(() => {
                    this.check()
                }, 500)
            },
            onFocus (event) {
                this.isFocused = true
                this.$emit('focus', this.$el.value, event)
            },
            onBlur () {
                this.isFocused = false
                this.touched = true
                this.check()
                this.$emit('blur')
            },
            focus () {
                this.$el.focus()
                this.onFocus()
            },
            onInput (event) {
                let value = event.target ? event.target.value : event
                this.$emit('input', value)
                this.$emit('change', value)
                this.$nextTick(() => {
                    this.check()
                })
            },
            check () {
                let success = true

                if (this.rexp) {
                    success = this.rexp.test(this.value) && String(this.value).length > 1
                } else if (this.required) {
                    success = !!this.value
                }

                this.success = success
                this.error = !success
                if (this.success) {
                    this.$emit('valid')
                }
                if (this.error) {
                    this.$emit('invalid')
                }
            },
            touch () {
                this.touched = true
                this.check()
            },
            onFocusWrap () {
                this.$el.querySelector('input').focus()
                this.$el.querySelector('input').click()
            },
            reset () {
                this.touched = false
                this.success = false
                this.error = false
                this.isFocused = false
            }
        },
        computed: {
            classes () {
                return {
                    'is-focus': this.isFocused,
                    'is-fill': !!this.value,
                    'is-error': this.error && this.touched,
                    'is-success': this.success,
                    'is-disabled': this.disabled
                }
            }
        },
        mounted () {
            if (this.regexp) {
                this.rexp = new RegExp(this.regexp)
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .ui-input {
        position relative
        margin-bottom 2rem
        border-radius 2px
        height 6rem
        line-height 16px
        font-size 14px
        width 100%
        user-select none
        border 1px solid rgba(#000, 0.2)
        box-sizing border-box
        display block
        transition border-color 0.3s
        outline none

        &.is-error {
            margin-bottom 2rem
        }

        &.is-disabled {
            pointer-events none
        }

        +layout-sm() {
            margin-bottom 1rem
        }

        /deep/ input {
            width 100%
            border 0 none
            outline none
            margin-top 3rem
            font-size 1.6rem
            padding 0 3rem 0 2.4rem
            opacity 0
            transition opacity 0.2s
        }

        &__icon {
            position absolute
            display flex
            top 0
            align-items center
            bottom 0
            right 2.4rem
        }

        &__placeholder {
            display flex
            position absolute
            top 2.2rem
            left 2.4rem
            align-items center
            height 1.6rem
            color rgba(#000, 0.3)
            font-size 1.4rem
            line-height 1.6rem
            transition top 0.3s, font-size 0.3s, color 0.3s
            pointer-events none
        }

        &__status {
            position absolute
            top 1.4rem
            height 2rem
            right 1.4rem
        }

        &__error {
            position absolute
            top 100%
            left 0
            margin-top 0.5rem
            font-size 1rem
            line-height 1.3rem
            color $primary

            +layout-md-and-up() {
                white-space nowrap
            }
        }

        &__icon {
            transition color 0.3s
            color rgba($black, 0.2)
            pointer-events none
        }

        &:hover &__icon {
            color rgba($black, 0.6)
        }

        &.is-focus,
        &:hover {
            border 1px solid rgba(#000, 0.6)
        }

        &.is-error {
            border 1px solid $primary
        }
        &.is-error &__input {
            color $primary
        }
        &.is-error,
        &.is-success,
        &.is-focus {
            /*border 1px solid #F7B70A*/
            box-sizing border-box
        }

        &.is-fill /deep/ &__input,
        &.is-success /deep/ &__input,
        &.is-focus /deep/ &__input {
            opacity 1
        }

        &.is-focus &__input {
            outline none
        }

        &.is-fill &__placeholder,
        &.is-focus &__placeholder {
            font-size 1.2rem
            top 1rem
        }
        +layout-sm() {}
    }
</style>

<template>
    <div class="ui-input-slider" :class="{'dont-touched': !touched}">
        <ui-input :placeholder="placeholder"
                  :value="inputValue"
                  :mask="currentMask"
                  :disabled="disabledInput"
                  @input="onChange"
                  @blur="onBlur"
                  @focus="onFocus"
        >
        </ui-input>
        <ui-slider class="ui-input-slider__slider" v-bind="{min, max}"
                   :value="value"
                   :min-text="minText"
                   :max-text="maxText"
                   :step="step"
                   @input="onChange">
        </ui-slider>
    </div>
</template>
<script>
    import UiInput from "@/components/ui/input";
    import UiSlider from "@/components/ui/slider";
    import formatNumber from '@/filters/number';
    import month from '@/filters/month'

    export default {
        components: {
            UiInput,
            UiSlider
        },
        filters: {
            formatNumber
        },
        data () {
            return {
                isFocus: false,
                touched: false,
                inited: false
            }
        },
        props: {
            value: [String, Number],
            type: {
                type: String,
                default: "number"
            },
            disabledInput: Boolean,
            step: Number,
            mask: [String, Object, Array],
            activeMask: [String, Object, Array],
            min: Number,
            max: Number,
            placeholder: String
        },
        computed: {
            currentMask () {
                return this.isFocus ? this.activeMask : this.mask
            },
            minText() {
                if (this.type === "month") {
                    return month(this.min)
                }
            },
            maxText() {
                if (this.type === "month") {
                    return month(this.max)
                }
            },
            inputValue () {
                if (this.type === 'month') {
                    return month(this.value)
                } else {
                    return this.value
                }
            },
            isMinimum () {
                let val = this.value.toString()
                val = parseFloat(val.replace(/\s+/g, ''))
                return this.min === val
            }
        },
        methods: {
            onChange(value) {
                if (this.inited) {
                    this.touched = true
                }
                let val = parseFloat(value.replace(/\s+/g, ''))

                if (this.max) {
                    if (val > this.max) {
                        value = this.max
                    }
                }

                this.$emit("input", value)
            },
            onBlur () {
                let val = parseFloat(this.value.replace(/\s+/g, ''))
                this.isFocus = false

                console.log(val, this.min, !this.value)
                if (this.min || !this.value) {
                    if (val < this.min || !this.value) {
                        this.$emit("input", this.min)
                    }
                }
            },
            onFocus () {
                this.isFocus = true
            }
        },
        mounted () {
            setTimeout(() => {
                this.inited = true
            }, 2000)
        }
    }
</script>
<style lang="stylus" scoped>
    .ui-input-slider {
        &__slider {
            margin-top: -3.4rem;

            +layout-sm() {
                margin-top: -2.4rem;
            }
        }
        /deep/ input {
            color $primary
        }
        &.dont-touched /deep/  .ui-input input {
            color $black
        }
        /deep/ .ui-input.is-fill .ui-input__placeholder {
            color rgba(#000, 0.8)
        }
        /deep/ .ui-input.is-focus,
        /deep/ .ui-input:hover {
            border 1px solid rgba(#000, 0.2)
        }
    }
</style>

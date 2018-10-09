<template>
    <portal>
        <transition name="ui-popup">
            <div class="ui-popup-wrap" v-if="isShow" @wheel.stop @scroll.stop>
                <div class="ui-popup" :class="[isWhite ? 'ui-popup--fade' : 'ui-popup--scale']">
                    <div class="ui-popup__container">
                        <a @click="onClose" class="ui-popup__close" :class="{'ui-popup__close--blue': isWhite}">
                            <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                                <rect width="0.992186" height="29.7656"
                                      transform="translate(0.211914 0.990387) scale(1.0018 0.998201) rotate(-45)"/>
                                <rect width="0.992186" height="29.7656"
                                      transform="translate(21.0854) scale(1.0018 0.998201) rotate(45)"/>
                            </svg>
                        </a>

                        <div class="ui-popup__body">
                            <slot></slot>
                        </div>
                    </div>
                </div>
                <ui-overlay class="is-fixed" :show="isShow" v-if="overlay" :isWhite="isWhite"/>
            </div>
        </transition>
    </portal>
</template>

<script>
    import Portal from '@/components/core/portal'
    import UiOverlay from '@/components/ui/overlay'

    export default {
        name: "poppup",
        data() {
            return {
                isShow: false
            };
        },
        components: {
            Portal,
            UiOverlay
        },
        props: {
            isWhite: Boolean,
            type: String,
            overlay: {
                type: Boolean,
                default: true
            },
            closeOnEsc: {
                type: Boolean,
                default: true
            },
            clickOutsideToClose: {
                type: Boolean,
                default: true
            }
        },
        beforeDestroy() {
            window.removeEventListener("keyup", this.onEscEvent);
            this.onHide();
        },
        mounted() {
            if (this.closeOnEsc) {
                this.onEscEvent = function (e) {
                    if (e.keyCode === 27) {
                        this.close();
                    }
                }.bind(this);
                window.addEventListener("keyup", this.onEscEvent);
            }
        },
        methods: {
            onShow() {
                // disabledScroll(true)
            },
            onHide() {
                // disabledScroll(false)
            },
            open() {
                this.isShow = true;
                this.$emit("open");
                window.document.body.style.overflow = 'hidden'
            },
            close() {
                this.isShow = false;
                this.$emit("close");
                window.document.body.style.overflow = null
            },
            onClose() {
                this.close();
            },
            onClick() {
                if (this.clickOutsideToClose) {
                    this.close();
                }
            }
        }
    };
</script>

<style rel="stylesheet/stylus" lang="stylus">
    .ui-popup-wrap {
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        right: 0;
        bottom: 0;
        z-index: 115;
        transition: 0.2s;
        line-height: 100%;
    }

    .ui-popup {
        position: relative;
        display: inline-block;
        z-index: 120;
        text-align: center;
        top: 0;
        bottom: 0;
        border-radius: 8px;
        transform-origin: center center;
        transition: opacity 0.15s, transform 0.2s;
        backface-visibility: hidden;
        will-change: opacity, transform, left, top;
        min-width: 280px;
        width: 100%;
        height: 100%;
        padding: 4.4rem 2rem;
        box-sizing: border-box;

        vertical-align middle
        &::after {
            content ""
            height 100%
            display inline-block
            vertical-align middle
        }

        +layout-sm-and-up() {
            max-width: 1020px;
        }

        +layout-sm() {
            padding: 2rem;
        }

        &__close {
            position: absolute;
            top: 40px;
            right: 40px;
            cursor: pointer;
            fill: rgba(#000, 0.4)
            +layout-sm() {
                top: 20px;
                right: 20px;
            }
        }

        &__container {
            display inline-block
            vertical-align middle
            position: relative;
            text-align: left;
            background: #FFFFFF;
            box-shadow: 0 6px 20px rgba(95, 95, 95, 0.3);
            padding 6rem 8rem
            border-radius 2px
            overflow hidden

            +layout-sm() {
                padding 6rem 2rem
            }
        }

        &__body {
            height: 100%;
        }

        &.is-type-message &__container {
            width: 100%;
            box-sizing: border-box;
            padding: 30px 20px 20px;

            +layout-sm-and-up() {
                min-width: 500px;
                padding: 40px;
            }
        }
    }

    .ui-popup-enter-active .ui-popup--scale, .ui-popup-leave-active .ui-popup--scale {
        opacity: 0;
        transform: scale(0.85);
    }

    .ui-popup-enter-active .ui-popup--fade, .ui-popup-leave-active .ui-popup--fade {
        opacity: 0;
    }

    .no-scroll {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
    }
</style>

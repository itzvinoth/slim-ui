<template>
	<div class="su-select">
		<select v-model="selected"
			ref="select"
			:multiple="multiple"
			:size="nativeSize"
			v-bind="$attrs"
			@change="onChange($event)"
			@blur="onBlur($event)"
			@focus="onFocus($event)">

			<option
				v-if="placeholder"
				:value="null"
				selected
				disabled
				hidden>
				{{ placeholder }}
			</option>
			<slot></slot>
		</select>

		<chevron-bottom-icon class="icon" width="16" height="16"></chevron-bottom-icon>
	</div>
</template>

<script>
import { ChevronBottomIcon } from 'vue-bytesize-icons'
	export default {
		name: "su-select",
		inheritAttrs: false,
		components: {
			ChevronBottomIcon
		},
		props: {
			value: {
				type: [String, Number, Boolean, Object, Array, Symbol, Function],
				default: null
			},
			placeholder: String,
			multiple: Boolean,
			nativeSize: [String, Number]
		},
		data () {
			return {
				selected: this.value,
				_isSelect: true,
				_elementRef: "select"
			}
		},
		methods: {
			onBlur (event) {
				this.isFocused = false
				this.$emit('blur', event)
			},
			onChange (event) {
				this.$emit('change', event)
			},
			onFocus (event) {
				this.isFocused = true
				this.$emit('focus', event)
			}
		},
		watch: {
			value (value) {
				this.selected = value
				!this.isValid
			},
			selected (value) {
				this.$emit("input", value)
				!this.isValid
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
.su-select {
    position: relative;
    width: 250px;
    // @extend .text-xsmall;

    .icon {
        position: absolute;
        top: 2px;
        right: 5px;
        font-size: 14px;
        pointer-events: none;
        color: #9b9b9b;
    }

    select {
        width: 100%;
        padding: 3px 30px 3px 0px;
        background: $color-solid-white;
        border-radius: 2px;
        border: none;
        border: 1px solid #e1e1e1;
        border-color: $color-mercury-grey;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        cursor: pointer;
        outline: none;
        option {
            box-sizing: content-box;
            padding: 10px;
        }
        &:focus {
            outline: none;
            border: none;
            border: 1px solid #e1e1e1;
        }
    }

}

</style>
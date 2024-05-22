<template>
	<div class="su-checkbox-group" :class="groupClass">
        <input :checked="isChecked" :id="id" v-bind="$props" @change="handleInput" :value="currentValue" class="su-checkbox" type="checkbox" :aria-label="ariaLabel" :role="role">
        <label :for="id" class="su-checkbox-label">
			<span class="su-checkbox-box"><span class="su-checkbox-tick"></span></span>
			<span class="su-checkbox-value" v-if="currentLabel" v-html="currentLabel"></span>
		</label>
	</div>
</template>

<script>
	export default {
		name: "su-checkbox",
		componentName: "suCheckbox",
		props: {
			name: String,
			tabindex: Number,
			value: Boolean,
			disabled: Boolean,
			autofocus: Boolean,
			title: String,
			checked: Boolean,
			indeterminate: Boolean,

			label: {
				type: String,
				default: ""
			},
			ariaLabel: {
				type: String,
				default: ""
			},
			role: {
				type: String,
				default: ""
			}
		},
		data () {
			return {
				attrs: {},
				id: "checkbox-0",
				currentLabel: this.label,
				currentValue: this.value,
				isChecked: this.checked,
				isIndeterminate: this.indeterminate
			}
		},
		mounted () {
			// Vue gives every component a unique id, _uid.
			this.id = "checkbox-" + this._uid

			if (this.value) {
				this.isChecked = true
			}
		},
		computed: {
			groupClass () {
				return {
					"indeterminate": this.isIndeterminate
				}
			}
		},
		watch: {
			label (newVal, oldVal) {
				if (oldVal !== newVal) {
					this.currentLabel = newVal
				}
			},
			value (value) {
				this.currentValue = value
				this.$emit("change", value)
				this.$emit("input", value)

				if (value) {
					this.isChecked = true
				} else {
					this.isChecked = false
				}
			},
			indeterminate (value) {
				this.isIndeterminate = value
			}
		},
		methods: {
			handleInput (event) {
				const v = event.target.checked
				this.isChecked = v
				this.currentValue = v

				this.$emit("input", v)
				this.$emit("change", event)
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";

$color-checked: $color-pomegranate-red;
$color-border: $color-silver-grey;
$color-background: $color-solid-white;
$color-focused: $color-mercury-grey;
$color-disabled: $color-seashell-white;

.su-checkbox-group {
	box-sizing: border-box;
	line-height: 1;

	.su-checkbox {
		opacity: 0;
		position: absolute;

		&:disabled + .su-checkbox-label {
			opacity: 0.5;
			cursor: not-allowed;
			// background: $color-disabled;
		}

		&:focus + .su-checkbox-label .su-checkbox-value {
			outline: none;
			border-bottom: 1px solid $color-focused;
		}

		&:checked + .su-checkbox-label .su-checkbox-tick {
			top: 3px;
		}
	}

	.su-checkbox-label {
		cursor: pointer;
	}

	.su-checkbox-value {
		vertical-align: middle;
		margin-left: 5px;
		border-bottom: 1px solid rgba(255, 255, 255, 0);
	}

	// The box.
	.su-checkbox-box {
		position: relative;
		display: inline-block;
		width: 15px;
		height: 15px;

		position: relative;
		overflow: hidden;
		cursor: pointer;

		border: 1px solid $color-border;
		box-sizing: border-box;
		border-radius: 2px;
	}

	// Tick.
	.su-checkbox-tick {
		top: 20px;
		left: 2px;
		right: 2px;
		width: 8px;
		height: 3px;
		content: '';
		position: absolute;
		border-left: 2px solid;
		border-bottom: 2px solid;
		margin: auto;

		transform: rotate(-45deg) translate3d(0, 0, 0);
		transform-origin: center center;
		// transition: top 0.5s cubic-bezier(.19, 1, .22, 1);
		border-color: $color-checked;
	}

	// "Dash".
	&.indeterminate {
		.su-checkbox-tick {
			transform: none;
			border-left: none;
		}
	}
}

</style>
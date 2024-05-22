<template>
	<div :class="classes">
		<label v-if="this.staticLabel || this.animate" :class="labelClasses">{{ currentLabel }}</label>

		<input :type="type" v-bind="$props" :placeholder="currentPlaceholder" :aria-label="ariaLabel" :role="role"
			@focus="onFocus()" @blur="onBlur()" @input="handleInput" :class="spinnerClasses" :value="currentValue" :readonly="readonly" autocorrect="off" autocapitalize="none" :required="required">
		<checkmark-icon :class="iconStatusClasses" v-if="hasStatus" width="16" height="16"></checkmark-icon>

		<div>
			<span class="su-message" v-if="!noError && message">{{ message }}</span>
		</div>

	</div>
</template>

<script>
export default {
	name: "su-input",
	props: {
		name: Number,
		minlength: Number,
		maxlength: Number,
		min: Number,
		max: Number,
		step: Number,
		value: [String, Number, Boolean],
		disabled: Boolean,
		readonly: Boolean,
		autofocus: Boolean,
		rows: Number,
		cols: Number,
		title: String,
		noerror: Boolean,
		errormessage: String,
		staticLabel: Boolean,
		pattern: String,
		hasStatus: {
			type: Boolean,
			default: false
		},
		hideSpinner: {
			type: Boolean,
			default: false
		},
		animate: {
			type: Boolean,
			default: true
		},
		type: {
			type: String,
			default: "text"
		},
		required: String,
		placeholder: {
			type: String,
			default: ""
		},
		label: {
			type: String,
			default: ""
		},
		rules: {
			type: Array,
			default: function () {
				return []
			}
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
			currentValue: this.value,
			currentLabel: this.label,
			currentPlaceholder: this.placeholder,
			labelVisible: false,
			message: this.errormessage,
			noError: this.noerror
		}
	},
	watch: {
		value (newVal, oldVal, e) {
			// console.log(newVal, oldVal, e)
			if (oldVal !== newVal) {
				this.currentValue = newVal
			}

		// 	// Number min / max validation.
			// if (this.max && newVal > this.max) {
			// 	this.currentValue = this.max
			// }
		},
		placeholder (newVal, oldVal) {
			if (oldVal !== newVal) {
				this.currentPlaceholder = newVal
			}
		},
		label (newVal, oldVal) {
			if (oldVal !== newVal) {
				this.currentLabel = newVal
			}
		}
	},
	created () {
	},
	mounted () {
		this.$nextTick(() => {
			if (!this.label) {
				this.currentLabel = this.currentPlaceholder
			}

			if (this.currentValue) {
				this.onFocus()
			}
		})
	},
	computed: {
		classes () {
			return {
				"su-input-group": true,
				"su-error-state": false,
				"su-static-label": this.staticLabel,
				"disabled": this.disabled
			}
		},
		labelClasses () {
			return ["su-input-label", {"su-visible": this.labelVisible, "su-dynamic-label": !this.staticLabel}]
		},
		spinnerClasses () {
			return {
				"su-spinner": this.hideSpinner
			}
		},
		iconStatusClasses () {
			return {
				"icon": this.hasStatus
			}
		}
	},
	methods: {
		// Events.
		onFocus (event) {
			if (!this.currentValue) {
				this.labelVisible = true && this.animate
				if (this.animate) {
					this.currentPlaceholder = ""
				}
			}
			this.$emit("focus", event)
		},
		onBlur (event) {
			if (!this.currentValue) {
				this.labelVisible = false
				this.currentPlaceholder = this.placeholder
			}
			this.$emit("blur", event)
		},
		handleInput (event) {
			const v = event.target.value
			this.$emit("input", v)
			this.currentValue = v
			this.$emit("change", event)

			// Clear the error message when the value has changed.
			this.hideError()
		},
		// UI helpers.
		showLabel () {
			this.labelVisible = true
		},
		hideLabel () {
			this.labelVisible = false
		},
		showError (message) {
			this.classes["su-error-state"] = true
			this.message = message
		},
		hideError (message) {
			this.classes["su-error-state"] = false
			this.message = ""
		},
		validate () {
			this.hideError()

			// Go through each rule for the element.
			let okay = true
			for (let rule of this.rules) {
				if (rule instanceof Object && (rule.validator || rule.required)) {
					let err = null
					if (rule.required && (!this.currentValue || this.currentValue.toString().trim().length === 0)) {
						// Required field?
						if (rule.message) {
							err = Error(rule.message)
						} else {
							err = Error(this.currentLabel + " is required")
						}
					} else if (rule.validator) {
						// Execute the custom validator.
						err = rule.validator(rule, this.currentValue)
					}

					// There was an error. Show it and stop further error checks.
					if (err instanceof Error) {
						this.showError(err.message)
						this.$emit("error", err)

						okay = false
						break
					}
				}
			}

			return okay
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
.su-input-group {
	position: relative;
	width: 250px;
	padding: 6px 0;

	input {
		border: 0;
		border: 1px solid $color-mercury-grey;
		padding: 8px;
		color: $color-tundora-grey;
		width: 100%;

		&:disabled {
			background-color: #ffffff;
			background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dddddd' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
			color: $color-silver-grey;
			cursor: not-allowed;
			box-sizing: border-box;
			padding: 8px;
			border-color: transparent;
		}
		&:focus {
			outline: 0;
			border-color: $color-silver-grey;
		}
	}

	.su-spinner::-webkit-inner-spin-button,
	.su-spinner::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	&.disabled {
		.su-input-label {
			color: $color-silver-grey;
		}
	}

	.su-input-label {
		display: block;
		visibility: hidden;
		margin-bottom: 4px;
	}

	.su-input-label.su-visible {
		@extend .slideInUp;
		@extend .animated;
		visibility: visible;
	}
	.su-dynamic-label {
		@extend .text-xsmall;
	}
	.su-input-label.su-dynamic-label {
		z-index: 5;
		position: absolute;
		top: -2px;
		background: #fff;
		padding: 0 5px;
		margin-left: 10px;
	}

	&.su-static-label .su-input-label {
		visibility: visible;
		animation: none;
	}

	&.uppercase {
		input, textarea, select {
			text-transform: uppercase;
		}
	}

	// Error state
	.su-message {
		@extend .slideInDown;
		@extend .animated;
		@extend .text-small;
		// visibility: hidden;
	}

	.su-message:empty:before {
		content: "\200b"; // Reserve space.
	}

	&.su-error-state input, &.su-error-state textarea, &.su-error-state select {
		border-color: $color-pomegranate-red;
	}

	&.su-error-state .su-message {
		color: $color-pomegranate-red;
	}

}


</style>
<template>
	<div class="su-radio-group">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "su-radio-group",
	componentName: "SuRadioGroup",
	props: {
		value: String,
		disabled: Boolean
	},
	watch: {
		value (value) {
			this.initChecked()
			this.$emit("change", value)
		}
	},
	mounted () {
		this.initChecked()
	},
	methods: {
		setValue (value, event) {
			this.$emit("input", value)
		},
		initChecked () {
			this.$nextTick(() => {
				this.$children.forEach((child) => {
					if (this.value !== "") {
						child.setChecked(this.value === child.value)
					}
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
$color-background: $color-solid-white;
$color-checked: $color-pomegranate-red;
$color-focused: $color-mercury-grey;
$color-default: $color-dusty-grey;

.su-radio-group {
	.su-radio-wrap {
		display: inline-block;
		margin-right: 20px;
	}

	.su-radio {
		opacity: 0;
		position: absolute;
	}

	.su-radio,
	.su-radio-label {
		display: inline-block;
		vertical-align: middle;
		cursor: pointer;
	}

	.su-radio-label {
		position: relative;
		border-bottom: 1px solid rgba(255, 255, 255, 0);
	}

	.su-radio + .su-radio-label:before {
		content: '';
		background: $color-background;
		border: 2px solid $color-dusty-grey;
		display: inline-block;
		vertical-align: middle;
		width: 3px;
		height: 3px;
		padding: 3px;
		margin: -1px 5px 0 0;
		text-align: center;
	}

	.su-radio + .su-radio-label:before {
		border-radius: 50%;
	}

	.su-radio:checked + .su-radio-label:before {
		padding: 4px;
		background: $color-checked;
		box-shadow: inset 0px 0px 0px 2px #fff;
		border: 1px solid $color-checked;
	}

	.su-radio:focus + .su-radio-label {
		outline: none;
	 	border-bottom: 1px solid $color-focused;
	}

	.disabled .su-radio-label {
		opacity: 0.5 !important;
		cursor: not-allowed;
	}
}

</style>
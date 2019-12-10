<template>
	<div :class="classes" :title="title">
		<input :checked="isChecked" :id="id" v-bind="$props" class="su-radio" type="radio" @change="handleInput">
		<label :for="id" class="su-radio-label">{{ currentLabel }}</label>
	</div>
</template>

<script>
	export default {
		name: "SuRadio",
		componentName: "SuRadio",
		props: {
			name: String,
			tabindex: Number,
			value: String,
			disabled: Boolean,
			autofocus: Boolean,
			title: String,
			checked: Boolean,

			label: {
				type: String,
				default: ""
			}
		},
		data () {
			return {
				currentLabel: this.label,
				id: "radio-0",
				attrs: {},
				isChecked: this.checked
			}
		},
		mounted () {
			// Vue gives every component a unique id, _uid.
			this.id = "radio-" + this._uid
		},
		watch: {
			label (newVal, oldVal) {
				if (oldVal !== newVal) {
					this.currentLabel = newVal
				}
			}
		},
		computed: {
			classes () {
				return {
					"su-radio-wrap": true,
					"disabled": this.disabled
				}
			}
		},
		methods: {
			handleInput (event) {
				this.$parent.setValue(event.target.value, event)
			},
			setChecked (status) {
				this.isChecked = status
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

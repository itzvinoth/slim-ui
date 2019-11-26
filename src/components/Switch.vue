<template>
	<div class="su-switch-group">
		<span v-if="stateOffLabel" class="su-switch-label su-switch-state-off">{{ stateOffLabel }}</span>

		<input :checked="isChecked" :id="id" v-bind="$props" @change="handleInput"
			:value="currentValue" class="su-switch" type="checkbox">

		<label :for="id" class="su-switch-control">{{ currentLabel }}</label>

		<span v-if="stateOnLabel" class="su-switch-label su-switch-state-on">{{ stateOnLabel }}</span>
	</div>
</template>

<script>
	export default {
		name: "su-switch",
		componentName: "suSwitch",
		props: {
			name: String,
			tabindex: Number,
			disabled: Boolean,
			autofocus: Boolean,
			title: String,

			value: String || Boolean,
			stateOn: String || Boolean,
			stateOff: String || Boolean,
			stateOnLabel: String,
			stateOffLabel: String,

			label: {
				type: String,
				default: ""
			}
		},
		data () {
			return {
				currentValue: this.value,
				isChecked: (this.value === this.stateOn),
				currentLabel: this.label,
				id: "switch-0",
				attrs: {}
			}
		},
		mounted () {
			// Vue gives every component a unique id, _uid.
			this.id = "switch-" + this._uid

			// 'on' or checked state. Switch toggled to the right.
			this.isChecked = (this.value === this.stateOn)
		},
		watch: {
			value (val) {
				this.currentValue = val
				this.isChecked = (val === this.stateOn)
			}
		},
		methods: {
			handleInput (event) {
				this.isChecked = event.target.checked
				this.currentValue = event.target.checked ? this.stateOn : this.stateOff

				this.$emit("input", this.currentValue)
				this.$emit("change", event)
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
$color-background: $color-solid-white;
$color-state1: $color-pomegranate-red;
$color-state2: $color-pomegranate-red;
$color-label: $color-dusty-grey;

.su-switch-group {
	.su-switch[type=checkbox]{
		display: none;
	}

	.su-switch-label {
		color: $color-label;
	}

	.su-switch-control {
		background: $color-state1;
		position: relative;
		text-indent: -9999px;
		cursor: pointer;

		display: inline-block;
		vertical-align: middle;
		width: 32px;
		height: 16px;
		border-radius: 100px;
	}

	.su-switch-control:after {
		background: $color-background;
		content: '';
		position: absolute;
		top: 3px;
		left: 4px;
		width: 10px;
		height: 10px;
		transition: 0.2s;
		border-radius: 90px;
	}

	.su-switch:checked + .su-switch-control {
		background: $color-state2;
	}

	.su-switch:checked + .su-switch-control:after {
		left: calc(100% - 5px);
		transform: translateX(-100%);
	}

	.su-switch:disabled + .su-switch-control {
		cursor: not-allowed;
	}

	.su-switch-control:active:after {
		width: 14px;
	}
}

</style>
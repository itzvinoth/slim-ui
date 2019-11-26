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

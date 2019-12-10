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

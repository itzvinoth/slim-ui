<template>
	<form @submit="onSubmit" :aria-label="ariaLabel" :role="role">
		<slot></slot>
	</form>
</template>

<script>
	export default {
		name: "su-form",
		props: {
			type: {
				type: String,
				default: "text"
			},
			placeholder: {
				type: String,
				default: ""
			},
			label: {
				type: String,
				default: ""
			},
			rules: {},
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
				errors: [],
				state: {
					hidden: true
				},
				currentValue: this.value,
				currentLabel: this.label,
				currentPlaceholder: this.placeholder
			}
		},
		watch: {
		},
		mounted () {
		},
		methods: {
			reset () {
			},
			validate () {
				this.errors = []

				let okay = true
				for (let child of this.$children) {
					if (child.hasOwnProperty("validate")) {
						if (!child.validate()) {
							if (child.message) {
								this.errors.push(child.message)
							}

							okay = false
						}
					}
				}

				return okay
			},
			onFocus () {
				if (!this.currentValue) {
					this.state = ["visible", "slideInUp", "animated"]
					this.currentPlaceholder = ""
				}
			},
			onBlur () {
				if (!this.currentValue) {
					this.state = ["hidden"]
					this.currentPlaceholder = this.placeholder
				}
			},
			handleInput (event) {
				const v = event.target.value
				this.$emit("input", v)
				this.currentValue = v
				this.$emit("change", v)
			},
			onSubmit (event) {
				this.$emit("submit", event)
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
</style>
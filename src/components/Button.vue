<template>
	<button :disabled="isDisabled" :type="type" :title="title">
		<slot v-if="!isProcessing"></slot>
		<su-loader v-if="isProcessing" :size="12"></su-loader>
	</button>
</template>

<script>
	export default {
		name: 'su-button',
		props: {
			disabled: Boolean,
			processing: Boolean,
			title: String,

			type: {
				type: String,
				default: "button"
			}
		},
		data () {
			return {
				isProcessing: this.processing,
				isDisabled: this.disabled
			}
		},
		watch: {
			processing (newVal, oldVal) {
				this.isProcessing = newVal
			},
			disabled (newVal, oldVal) {
				this.isDisabled = newVal
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";

.button,
button {
	background: $color-dusty-grey;
	color: $color-solid-white;
	padding: 5px 20px;
	border-radius: 2px;
	border: 1px solid $color-dusty-grey;
	font-weight: 400;
	font-size: 0.825rem;
	letter-spacing: 0.5px;
	display: inline-block;
	cursor: pointer;

	&:hover {
		opacity: 0.8;
	}

	&:focus {
		outline: 0;
		opacity: 0.8;
	}

	&[disabled] {
		cursor: not-allowed;
	}

	&[disabled]:hover {
		opacity: 1;
	}


	.su-loader {
		border-color: $color-solid-white;
		border-top-color: $color-dusty-grey;
	}

	// Various button styles.
	&.button-outline {
		color: $color-solid-grey;
		background: $color-solid-white;
	}

	&.button-green {
		color: $color-solid-white;
		background: $color-fruit-salad-green;
		border-color: $color-fruit-salad-green;

		&.button-outline {
			color: $color-fruit-salad-green;
			background: $color-solid-white;
			border-color: $color-fruit-salad-green;

			&:hover {
				opacity: 1;
				color: $color-solid-white;
				background: $color-fruit-salad-green;
				border-color: $color-fruit-salad-green;
			}
		}

	}

	&.button-blue {
		color: $color-solid-white;
		background: $color-havelock-blue;
		border-color: $color-havelock-blue;

		&.button-outline {
			color: $color-havelock-blue;
			background: $color-solid-white;
			border-color: $color-havelock-blue;

			&:hover {
				opacity: 1;
				color: $color-solid-white;
				background: $color-havelock-blue;
				border-color: $color-havelock-blue;
			}
		}
	}

	&.button-orange {
		color: $color-solid-white;
		background: $color-solid-orange;
		border-color: $color-solid-orange;

		&.button-outline {
			color: $color-solid-orange;
			background: $color-solid-white;
			border-color: $color-solid-orange;

			&:hover {
				opacity: 1;
				color: $color-solid-white;
				background: $color-solid-orange;
				border-color: $color-solid-orange;
			}
		}

		.su-loader {
			border-color: $color-solid-white;
			border-top-color: $color-solid-orange;
		}
	}

	&.button-grey {
		background: $color-dusty-grey;
		color: $color-solid-white;
		border-color: $color-dusty-grey;

		&.no-hover {
			&:hover {
				background: $color-dusty-grey;
				color: $color-solid-white;
				border-color: $color-dusty-grey;
			}
		}
	}

	&.button-outline {
		color: $color-solid-grey;
		background: $color-solid-white;
		border-color: $color-dusty-grey;

		&:hover {
			background: $color-dusty-grey;
			color: $color-solid-white;
			border-color: $color-dusty-grey;
		}
	}

	&.button-small {
		// @extend .text-xsmall;
		padding: 6px 12px;
		line-height: 1;
	}

	&.button-text {
		border: none;
		background: transparent;
		color:  $color-dusty-grey;
	}
}

</style>

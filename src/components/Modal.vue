<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class="modal-header">
						<slot name="header"></slot>
					</div>

					<div class="modal-body">
						<slot name="body"></slot>
					</div>

					<div class="modal-footer">
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>

	export default {
		name: "su-modal",
		props: {
			closeOnClick: {
				type: Boolean,
				default: true
			},
			zIndex: {
				type: Number,
				default: 15
			}
		},
		data () {
			return {
				keyboardShortcutEvents: [
					// Close on escape
					{ keys: ["27"], cb: this.close, stop: true, prevent: true }
				]
			}
		},
		mounted () {
			this.$nextTick(() => {
				if (this.closeOnClick) {
					window.addEventListener("click", this.closeOnDocumentClick)
				}

				this.$el.style.zIndex = this.zIndex
				document.body.classList.add("modal-open")
			})
		},
		beforeDestroy () {
			window.removeEventListener("click", this.closeOnDocumentClick)
		},
		methods: {
			closeOnDocumentClick (event) {
				// If clicked in modal wrapper than close the popup
				if (event.target === this.$el || event.target === this.$el.querySelector(".modal-wrapper")) {
					this.close()
				}
			},
			close () {
				this.$emit("close")
				document.body.classList.remove("modal-open")
			}
		}
	}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
.modal-mask {
	background: rgba($color-solid-black, 0.2);
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 15;
	position: fixed;
	overflow-y: scroll;
	perspective: 1000px;
}

.modal-wrapper {
	margin-top: 10%;
	margin-bottom: 60px;
	transform-origin: 0 0;
	animation: swing-in 150ms ease;
}

.modal-container {
	width: 700px;
	color: #333;
	margin-left: auto;
	margin-right: auto;
	max-width: 100%;
	background: $color-solid-white;
	padding: 25px;
	position: relative;
	box-shadow: 0 2px 8px 0 rgba($color-solid-black, 0.2);
}

.modal-header {
	margin-bottom: 20px;

	h1, h2, h3, h4, h5 {
		margin-top: 0;
		font-weight: 600;
	}
}

.modal-default-button {
	float: right;
}

.modal-enter {
	opacity: 0;
}

.modal-leave-active {
	opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
	-webkit-transform: scale(1);
	transform: scale(1);
}

.modal-footer {
	button {
		margin-left: 5px;
	}
}

.modal-body {
	padding: 5px 0;
}

.modal-footer {
	margin-top: 20px;
	padding-top: 20px;
	border-top: 1px solid $color-wild-sand-grey;

	.actions {
		text-align: right;
	}
}

@media (max-width: 767px) {
	.modal-mask {
		.modal-container {
			max-width: 500px;
			width: 500px;
			padding: 10px 15px;
			box-sizing: border-box;
		}
	}

	.modal-close span {
		font-size: 1.25rem;
	}
}

</style>
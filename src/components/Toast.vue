<template>
	<div class="su-toast-groups">
		<div v-for="o in orientations" :key="o" :class="o" class="su-toast-group">
			<transition-group name="toast-list" tag="div">
				<div v-for="toast in toasts[o]" :key="toast.id" :class="toast.classes"
					@mouseover="handleToastHover(toast)" @mouseleave="handleToastLeave(toast)">
					<div :class="['su-toast-icon', 'icon', icons[toast.type]]"></div>
					<div class="message" v-html="toast.message"></div>
					<span class="icon icon-times close" v-if="toast.closable" @click="remove(toast.id, toast.orientation)"></span>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
export default {
	name: "su-toast",
	props: {
		eventBus: null
	},
	data () {
		const types = {
			INFO: "INFO",
			SUCCESS: "SUCCESS",
			ERROR: "ERROR",
			WARNING: "WARNING",
			LOADING: "LOADING"
		}

		const icons = {
			INFO: "icon-info",
			SUCCESS: "icon-check",
			ERROR: "icon-alert-triangle",
			WARNING: "icon-alert-triangle",
			LOADING: "loading"
		}

		const orientations = {
			TOP_LEFT: "su-toast-top-left",
			TOP_CENTER: "su-toast-top-center",
			TOP_RIGHT: "su-toast-top-right",
			BOTTOM_LEFT: "su-toast-bottom-left",
			BOTTOM_CENTER: "su-toast-bottom-center",
			BOTTOM_RIGHT: "su-toast-bottom-right"
		}

		return {
			// This holds a key for each orientation and the individual
			// toasts are inserted into those as lists.
			toasts: {},
			test: null,
			types: types,
			orientations: orientations,
			icons: icons,
			default: {
				message: "",
				duration: 3000,
				class: "info",
				type: types.INFO,
				closable: true,
				orientation: orientations.TOP_RIGHT
			}
		}
	},
	created () {
		if (!this.eventBus) {
			throw Error("Missing 'event-bus' property in toast")
		}

		// Create the stacks for each orientation.
		for (let k in this.orientations) {
			this.toasts[this.orientations[k]] = []
		}

		// Bind the toast event.
		this.eventBus.$on("su-toast", this.insert)
	},
	methods: {
		// Public handler for showing a toast.
		insert (toast) {
			// Assign a random ID to the toast element.
			let id = "toast-" + Math.floor(Math.random() * 100000)
			let toastClass = toast.class || this.default.class
			let toastTypeClass = (toast.type || this.default.type).toLowerCase()

			let classes = {
				"su-toast-item": true,
				[toastTypeClass]: true,
				[toastClass]: true
			}

			// Merge default params.
			let t = {id, ...this.default, ...toast, classes}

			t.timer = window.setTimeout(() => {
				this.remove(id, t.orientation)
			}, t.duration)

			var newToasts = { ...this.toasts }
			newToasts[t.orientation].push(t)
			this.toasts = newToasts
		},
		remove (id, orientation) {
			if (!id || !orientation) {
				return
			}

			let newToasts = { ...this.toasts }
			let newItems = []
			for (let item of newToasts[orientation]) {
				if (item.id !== id) {
					newItems.push(item)
				}
			}

			newToasts[orientation] = newItems
			this.toasts = newToasts
		},
		// Clean current toast timer to stop removing it
		handleToastHover (toast) {
			if (toast.timer) window.clearTimeout(toast.timer)
		},
		// Start timer to remove after mouseleave
		handleToastLeave (toast) {
			toast.timer = window.setTimeout(() => {
				this.remove(toast.id, toast.orientation)
			}, toast.duration)
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
$color-yellow: #ffbf00;
$color-background: $color-solid-white;
$color-icon-background: $color-solid-grey;
$color-icon-color: $color-solid-white;
$color-success: $color-fruit-salad-green;
$color-info: $color-lochmara-blue;
$color-success: $color-fruit-salad-green;
$color-error: $color-pomegranate-red;
$color-warning: $color-yellow;

.su-toast-groups {
	.su-toast-group {
		position: fixed;
		z-index: 100;
		pointer-events: none;

		div:first-child {
			position: relative;
		}
	}

	/* Orientations */
	.su-toast-top-left {
		top: 75px;
		left: 20px;
	}
	.su-toast-top-right {
		top: 75px;
		right: 20px;
	}
	.su-toast-top-center {
		top: 75px;
		left: 50%;
		transform: translate(-50%, 0);
	}
	.su-toast-bottom-left {
		bottom: 75px;
		left: 20px;
	}
	.su-toast-bottom-right {
		bottom: 75px;
		right: 20px;
	}
	.su-toast-bottom-center {
		bottom: 75px;
		left: 50%;
		transform: translate(-50%, 0);
	}

	.su-toast-item {
		display: flex;
		box-sizing: border-box;
		max-width: 400px;
		min-width: 300px;
		pointer-events: all;
		position: relative;
		margin: 0 auto 10px auto;
		padding: 10px 30px 15px 15px;
		transition: opacity .2s, transform .2s;
		background: $color-solid-white;
		border: 1px solid $color-gallery-grey;
		box-shadow: 2px 2px 4px $color-gallery-grey;
		border-left: 20px solid $color-gallery-grey;
		border-radius: 5px;

		&.info {
			color: $color-havelock-blue;
			border-left-color: $color-havelock-blue;
		}

		&.success {
			color: $color-success;
			border-left-color: $color-success;
		}

		&.warning {
			color: $color-warning;
			border-left-color: $color-warning;
		}

		&.error {
			color: $color-error;
			border-left-color: $color-error;
		}

		.message {
			margin: 5px 0;
			color: $color-solid-grey;
		}
	}

	.toast-list-enter {
		opacity: 0;
		transform: translateY(-30px);
	}

	.toast-list-leave-active {
		display: none;
	}

	.su-toast-icon {
		display: inline-block;
		vertical-align: middle;
		margin-right: 5px;
		font-size: 1.3rem;
		@extend .text-initial;
	}

	// Toast themes.
	.su-toast-item.info .su-toast-icon {
		color: $color-info;
	}

	.su-toast-item.success .su-toast-icon {
		color: $color-success;
	}

	.su-toast-item.warning .su-toast-icon {
		color: $color-warning;
	}

	.su-toast-item.error .su-toast-icon {
		color: $color-error;
	}

	.close {
		position: absolute;
		right: 15px;
		top: 15px;
		cursor: pointer;
	}
}

</style>

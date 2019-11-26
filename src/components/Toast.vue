<template>
	<div class="su-toast-groups">
		<div v-for="o in orientations" :key="o" :class="o" class="su-toast-group">
			<transition-group name="toast-list" tag="div">
				<div v-for="toast in toasts[o]" :key="toast.id" :class="toast.classes"
					@mouseover="handleToastHover(toast)" @mouseleave="handleToastLeave(toast)">
					<div :class="['su-toast-icon', 'icon', icons[toast.type]]"></div>
					<div class="message">{{ toast.message }}</div>
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
		pointer-events: all;
		position: relative;
		// text-align: center;
		margin: 0 auto 10px auto;
		background: $color-background;
		border: 1px solid rgba($color-solid-black, 0.2);
		border-left-width: 6px;

		border-radius: 2px;
		padding: 10px 50px 10px 10px;
		// box-shadow: 0 2px 8px rgba(0, 0, 0, .2);

		transition: opacity .2s, transform .2s;

		&.info {
			color: $color-havelock-blue;
			border-color: rgba($color-havelock-blue, 0.25);
			background: rgba(lighten($color-havelock-blue, 35%), 0.9);
		}

		&.success {
			color: $color-success;
			border-color: rgba($color-success, 0.25);
			background: rgba(lighten($color-success, 45%), 0.9);
		}

		&.warning {
			color: $color-warning;
			border-color: rgba($color-warning, 0.25);
			background: rgba(lighten($color-warning, 45%), 0.9);
		}

		&.error {
			color: $color-error;
			border-color: rgba($color-error, 0.25);
			background: rgba(lighten($color-error, 40%), 0.9);
		}

		.message {
			margin: 5px 0;
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
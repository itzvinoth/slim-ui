<template>
	<div class="su-loader">
		<span class="dot-spinner"><i></i><i></i><i></i><i></i></span>
	</div>
</template>

<script>
export default {
	name: "su-loader",
	props: {
		size: Number
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
.su-loader {
	display: inline-block;
}

.dot-spinner {
    margin-left: 5px;
    display: inline-block;
}

.dot-spinner i {
	display: inline-block;
	width: 6px;
	height: 6px;

	border-radius: 50%;
    background: $color-dusty-grey;
    vertical-align: middle;
}

button {
    .dot-spinner {
        margin: 0;
        padding: 0;
    }

    .dot-spinner i {
        background: #fff;
    }
}

.dot-spinner i:first-child {
	transform: translate(-5px);
	animation: dot-spinner-ani2 .5s linear infinite;

	opacity: 0;
}

.dot-spinner i:nth-child(2),
.dot-spinner i:nth-child(3) {
	animation: dot-spinner-ani3 .5s linear infinite;
}

.dot-spinner i:last-child {
	animation: dot-spinner-ani1 .5s linear infinite;
}

@keyframes dot-spinner-ani1 {
	100% {
		transform: translate(10px);
		opacity: 0;
	}
}
@keyframes dot-spinner-ani2 {
	100% {
		transform: translate(5px);
		opacity: 1;
	}
}
@keyframes dot-spinner-ani3 {
	100% {
		transform: translate(5px);
	}
}

</style>
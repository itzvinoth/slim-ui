function tooltip (el, binding, vnode) {
	if (window.innerWidth < 1023) return

	var msg = el.getAttribute("title")
	var pos = el.getAttribute("tooltip-pos")
	if (!msg || msg === "") {
		// el.removeAttribute("data-balloon")
		return
	}
	var len = binding.value

	el.removeAttribute("title")
	el.setAttribute("data-balloon", msg)
	el.setAttribute("data-balloon-pos", pos || "up")

	if (len) {
		el.setAttribute("data-balloon-length", len)
	}
}

export default {
	bind: tooltip,
	update: tooltip
}

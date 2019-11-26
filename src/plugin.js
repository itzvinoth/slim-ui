import Button from './components/Button.vue'
import Checkbox from './components/Checkbox.vue'
import Form from "./components/Form"
import Input from "./components/Input"
import Radio from "./components/Radio"
import Switch from "./components/Switch"
import Loader from "./components/Loader"
import Modal from "./components/Modal"
import Toast from "./components/Toast.vue"
import Select from "./components/Select.vue"
import RadioGroup from "./components/RadioGroup"
import TinyTabs from "./components/TinyTabs"
import MultiSelect from "./components/MultiSelect"
import DataTable from "./components/DataTable"
import tooltip from "./directives/tooltip"
import Events from './events'

class ToastClass {
	constructor (eventBus, Vue) {
		this.eventBus = eventBus
    	this.component = this.mountComponent(eventBus, Vue)

		// Orientation constants.
		this.TOP_LEFT = this.component.orientations.TOP_LEFT
		this.TOP_CENTER = this.component.orientations.TOP_CENTER
		this.TOP_RIGHT = this.component.orientations.TOP_RIGHT
		this.BOTTOM_LEFT = this.component.orientations.BOTTOM_LEFT
		this.BOTTOM_CENTER = this.component.orientations.BOTTOM_CENTER
		this.BOTTOM_RIGHT = this.component.orientations.BOTTOM_RIGHT
	}

	mountComponent (eventBus, Vue) {
    	let ToastConstructor = Vue.extend(Toast)
		let instance = new ToastConstructor({
			propsData: {
				eventBus: eventBus
			}
		})

		instance.vm = instance.$mount()
		document.body.appendChild(instance.vm.$el)
		return instance
	}

	open (options) {
		this.eventBus.$emit("su-toast", options)
	}

	success (options) {
		options.type = this.component.types.SUCCESS
		this.eventBus.$emit("su-toast", options)
	}

	error (options) {
		options.type = this.component.types.ERROR
		this.eventBus.$emit("su-toast", options)
	}

	info (options) {
		options.type = this.component.types.INFO
		this.eventBus.$emit("su-toast", options)
	}

	warning (options) {
		options.type = this.component.types.WARNING
		this.eventBus.$emit("su-toast", options)
	}

	loading (options) {
		options.type = this.component.types.LOADING
		this.eventBus.$emit("su-toast", options)
	}
}

let eventsInstance = new Events()

const components = {
  [Button.name]: Button,
  [Checkbox.name]: Checkbox,
  [Form.name]: Form,
  [Input.name]: Input,
  [Radio.name]: Radio,
  [Switch.name]: Switch,
  [Loader.name]: Loader,
  [Modal.name]: Modal,
  [Toast.name]: Toast,
  [Select.name]: Select,
  [RadioGroup.name]: RadioGroup,
  [TinyTabs.name]: TinyTabs,
  [MultiSelect.name]: MultiSelect,
  [DataTable.name]: DataTable
}

function install(Vue, options) {
  if (options && options.components) {
    options.components.forEach(c => Vue.component(c.name, components[c.name]))
  } else {
    Object.keys(components).forEach((key) => {
      Vue.component(key, components[key])
    })
  }
  Vue.directive('tooltip', tooltip)
  // Add Vue instance methods by attaching them to Vue.prototype.
  Vue.prototype.$clone = (obj) => JSON.parse(JSON.stringify(obj))

  // Register events and pass it as prop to all child components
  Vue.prototype.$events = eventsInstance
  Vue.prototype.$toast = new ToastClass(eventsInstance.eventBus, Vue)
}

// // Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use({ install })
}

export default { install }

export {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Switch,
  Loader,
  Toast,
  Modal,
  Select,
  RadioGroup,
  TinyTabs,
  MultiSelect,
  DataTable
}

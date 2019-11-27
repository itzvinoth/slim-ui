<template>
    <div :style="containerStyle" class="multiselect">
        <div class="multiselect__select" :style="inputStyle" @click="keyCapture">
            <p v-show="false"> {{ currItem }}</p>
            <ul class="multiselect__tags">
                <li class="multiselect__tag" v-for="data in selectedValues" :key="data.label">
					{{ data.label }}
					<span class="close" @click="clearItem($event, data)">&times;</span>
				</li>
                <li class="multiselect__tag">
                    <input type="text" class="search" ref="listsearch" v-model="search" @focus="onFocus" @keydown="keyMonitor"></input>
                </li>
            </ul>
        </div>
        <ul v-show="showLabels" class="multiselect__content" id="labels" :style="labelStyle">
            <li class="multiselect__content--elem" @keyup="navOnLabel" @keypress="onEnterPress" v-for="(data, index) in filteredOptions" :key="data.name" :class="{navcolor: data.navigate, selected: data.selected}" @click="onLabelClick(data, index)"> {{ data.label }} </li>
        </ul>
    </div>
</template>

<script>
export default {
	name: 'su-multi-select',
	data () {
		return {
			showLabels: false,
			search: '',
			currItem: 1,
			divHeight: 0
		}
	},
	props: {
		options: {
			type: [Object, Array],
			required: true
		},
		trackBy: {
			type: String,
			required: false
		},
		width: {
			type: [Number, String],
			required: false
		},
		label: {
			type: String,
			required: false
		},
		selectedValues: {
			type: [Object, Array],
			required: false
		}
    },
    // if any values list of objects present in selected values, then those values are selected..
	beforeMount () {
		this.options.map((item, index) => {
			item.navigate = false
			item.itemId = index + 1
			if (this.selectedValues.map(val => val.name).indexOf(item.name) > -1) {
				item.selected = true
			} else {
				item.selected = false
			}
		})
	},
	created () {
		this.heightChange()
	},
	updated () {
		this.heightChange()
	},
	mounted () {
		document.addEventListener("keyup", this.navOnLabel)
		document.addEventListener("keypress", this.onEnterPress)
		window.addEventListener("click", this.onSelectContainer)
	},
	destroyed () {
		document.removeEventListener("keyup", this.navOnLabel)
		document.removeEventListener("keypress", this.onEnterPress)
		window.removeEventListener("click", this.onSelectContainer)
	},
	methods: {
        // on click of the multi select element we need to show the dropdown, or hide it..
		onSelectContainer (event) {
            if (document.getElementsByClassName('multiselect')[0].contains(event.target)) {
				this.showLabels = true
			} else {
                this.showLabels = false
            }
        },
        // push new item to the array list
        addItem (array, item) {
            let sValue = {}
            sValue[this.trackBy] = item[this.trackBy]
            sValue[this.label] = item[this.label]
            array.push(sValue)
            return array
        },
        // remove item from the array list
        removeItem (array, item) {
            array.splice(array.map(val => val[this.trackBy]).indexOf(item[this.trackBy]), 1)
        },
		keyMonitor (event) {
			let evtkey = event.keyCode
			let valLength = this.selectedValues.length
			if ((evtkey >= 48 && evtkey <= 57) || (evtkey >= 65 && evtkey <= 90) || (evtkey >= 97 && evtkey <= 122) || (evtkey == 8)) {
				if (this.search.length <= 0 && evtkey == 8 && valLength > 0) {
					for (var key in this.filteredOptions) {
						if (this.filteredOptions[key][this.trackBy].indexOf(this.selectedValues[valLength -1][this.trackBy]) > -1) {
							this.selectedValues.splice((valLength-1), 1)
							this.filteredOptions[key].selected = !this.filteredOptions[key].selected
							break
						}
					}
				}
				this.$nextTick(() => {
					this.search = event.target.value
					this.currItem = 1
				})
			}
        },
        // based on selected values height of the box varies..
		heightChange () {
			let str = this.selectedValues.join()
			this.divHeight = (Math.ceil((str.length+1) / 45)) * 40
        },
        // on select of the multi select container it needs to focus on the input field..
		keyCapture () {
			this.$nextTick(() => {
				this.$refs.listsearch.focus()
			})
		},
		// Deselects or removes the element from the multi-select div when clicking the close button...
		clearItem (event, item) {
            this.removeItem(this.selectedValues, item)
            item.selected = !item.selected
        },
        // show labels list on focus of the multi select container..
		onFocus () {
			this.showLabels = true
		},
		// Selects or append the elements to the multi-select div when clicking on the list elements...
		onLabelClick (data, index) {
            data.selected = !data.selected
            // this.showLabels = true
            this.search = ''
            this.filteredOptions.map(item => {
                if (item[this.trackBy].toLowerCase().indexOf(data[this.trackBy].toLowerCase()) > -1 && item.selected == true) {
                    this.addItem(this.selectedValues, item)
                } else if (item[this.trackBy].toLowerCase().indexOf(data[this.trackBy].toLowerCase()) > -1 && item.selected == false) {
                    this.removeItem(this.selectedValues, data)
                }
            })
		},
		// Naviate through label items on key up & down
		navOnLabel () {
			let getLabel = document.getElementById('labels')
			if (event.keyCode == 38) {
				if (this.currItem !== 1) {
					this.currItem--
					getLabel.scrollBy(0, -20)
				} else {
					this.currItem = this.currItem + this.filteredOptions.length-1
					getLabel.scrollBy(0, (20*this.filteredOptions.length-1))
				}
			} else if (event.keyCode == 40) {
				if (this.currItem !== this.filteredOptions.length) {
					this.currItem++
					getLabel.scrollBy(0, 20)
				} else {
					this.currItem = this.currItem - (this.filteredOptions.length-1)
					getLabel.scrollBy(0, (-20*this.filteredOptions.length-1))
				}
			}
			this.filteredOptions.map((item, index) => {
				if (item[this.trackBy] == this.filteredOptions[this.currItem-1][this.trackBy]) {
					item.navigate = true
				} else {
					item.navigate = false
				}
			})
		},
		// Select & Deselect Labels on keypress Enter
		onEnterPress () {
			if (event.keyCode == 13) {
                var filteredCurrentOption = this.filteredOptions[this.currItem - 1]
				if (filteredCurrentOption.selected === false) {
                    this.addItem(this.selectedValues, filteredCurrentOption)
					filteredCurrentOption.selected = true
					this.search = ''
					// this.currItem = 1
				} else {
                    filteredCurrentOption.selected = false
                    this.removeItem(this.selectedValues, filteredCurrentOption)
				}
			}
		}
	},
	computed: {
		// Filter Lists based upon search
		filteredOptions () {
			return this.options.filter(item => {
				return item.label.toLowerCase().indexOf(this.search.toLowerCase()) > -1
			})
		},
		// Conditional style rendering
		containerStyle () {
			return { width: (this.width !== undefined ? this.width+'px': '300px') }
		},
		inputStyle () {
			return { height: this.divHeight+'px' }
		},
		iconStyle () {
			return { left: '335px', position: 'absolute', top: (this.showLabels) ? '18px' : '10px' }
		},
		labelStyle () {
			return { position: 'absolute', width: (this.width !== undefined ? this.width+'px': '300px') }
		}
	}
}
</script>

<style lang="scss" scoped>
.multiselect__select {
	border: 1px solid #CCC;
	width: 100%;
}
.selected {
	background: #41c69e;
}
.navcolor {
	color: #c0f0e1;
}
ul.multiselect__tags {
	list-style-type: none;
	padding: 0;
	display: inline-block;
	margin: 5px 0;
}
ul.multiselect__content {
	list-style-type: none;
	padding: 0;
	border: 1px solid #CCC;
	background-color: #FFF;
	display: inline-block;
	max-height: 100px;
	overflow-y: auto;
	z-index: 20;
}
li.multiselect__content--elem {
	padding: 4px;
	text-align: left;
	position: relative;
}
li.multiselect__tag {
	cursor: pointer;
	float: left;
	display: inline-block;
	border: 1px solid #CCC;
	border-radius: 2px;
	padding-left: 4px;
	padding-top: 4px;
	padding-bottom: 4px;
	padding-right: 14px;
	margin-left: 5px;
	margin-bottom: 4px;
	display: block;
	position: relative;
	&:last-child {
		border: 0 !important;
	}
}
.close {
	cursor: pointer;
	position: absolute;
	top: 50%;
	right: 0%;
	transform: translate(0%, -50%);
}
input.search {
	border: 0;
	width: 65px;
	&:focus {
		outline: none;
	}
}
</style>

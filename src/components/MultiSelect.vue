<template>
  <div :style="containerStyle" class="multiselect">
    <div class="multiselect__select" :style="inputStyle" @click="keyCapture">
      <ul class="multiselect__tags">
        <li class="multiselect__tag" v-for="data in selectedValues" :key="data.label">
          {{ data.label }}
          <span class="close" @click="clearItem(data)">&times;</span>
        </li>
        <li class="multiselect__tag">
          <input type="text" class="search" ref="listsearch" :placeholder="placeholder" v-model="search" @focus="onFocus" @keydown="keyMonitor" />
        </li>
      </ul>
    </div>
    <ul v-show="showLabels" class="multiselect__content" id="labels" :style="labelStyle">
      <li class="multiselect__content--elem" v-for="(data, index) in filteredOptions" :key="data.name" :class="{navcolor: data.navigate, selected: data.selected}" @click="onLabelClick(data, index)"> {{ data.label }} </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'multi-select',
  data() {
    return {
      showLabels: false,
      search: '',
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
    },
    placeholder: {
      type: String,
      required: false
    }
  },
  // if any values list of objects present in selected values, then those values are selected..
  beforeMount() {
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
  created() {
    this.heightChange()
  },
  updated() {
    this.heightChange()
  },
  mounted() {
    window.addEventListener("click", this.onSelectContainer)
  },
  destroyed() {
    window.removeEventListener("click", this.onSelectContainer)
  },
  methods: {
    // based on selected values height of the box varies..
    heightChange() {
      this.divHeight = (Math.ceil((this.selectedValues.join().length + 1) / 45)) * 40
    },
    // show labels list on focus of the multi select container..
    onFocus() {
      this.showLabels = true
    },
    // on click of the multi select element we need to show the dropdown, or hide it..
    onSelectContainer(event) {
      if (document.querySelector('.multiselect').contains(event.target)) {
        this.showLabels = true
      } else {
        this.showLabels = false
      }
    },
    // push new item to the array list
    addItem(array, item) {
      let sValue = {
        [this.trackBy]: item[this.trackBy],
        [this.label]: item[this.label]
      }
      return array.push(sValue)
    },
    // remove item from the array list
    removeItem(array, item) {
      array.splice(array.map(val => val[this.trackBy]).indexOf(item[this.trackBy]), 1)
    },
    // Deselects or removes the element from the multi-select div when clicking the close button...
    clearItem(selectedItem) {
      this.filteredOptions.map((item) => {
				if (item[this.trackBy].indexOf(selectedItem[this.trackBy]) > -1) {
          this.removeItem(this.selectedValues, selectedItem)
					item.selected = !item.selected
				}
			})
    },
    keyMonitor(event) {
      /* eslint-disable no-console */
      let valLength = this.selectedValues.length
      if (valLength > 0 && event.keyCode == 8) {
        this.clearItem(this.selectedValues[valLength - 1])
      }
      this.$nextTick(() => {
        this.search = event.target.value
      })
    },
    // on select of the multi select container it needs to focus on the input field..
    keyCapture() {
      this.$nextTick(() => {
        this.$refs.listsearch.focus()
      })
    },
    // Selects or append the elements to the multi-select div when clicking on the list elements...
    onLabelClick(data) {
      data.selected = !data.selected
      this.search = ''
      this.filteredOptions.map(item => {
        if (item[this.trackBy].toLowerCase().indexOf(data[this.trackBy].toLowerCase()) > -1 && item.selected == true) {
          this.addItem(this.selectedValues, item)
        } else if (item[this.trackBy].toLowerCase().indexOf(data[this.trackBy].toLowerCase()) > -1 && item.selected == false) {
          this.removeItem(this.selectedValues, data)
        }
      })
    }
  },
  computed: {
    // Filter Lists based upon search
    filteredOptions() {
      return this.options.filter(item => {
        return item[this.label].toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    },
    // Conditional style rendering
    containerStyle() {
      return {
        width: (this.width !== undefined ? this.width + 'px' : '300px')
      }
    },
    inputStyle() {
      return {
        height: this.divHeight + 'px'
      }
    },
    labelStyle() {
      return {
        position: 'absolute',
        width: (this.width !== undefined ? this.width + 'px' : '300px')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.multiselect__select {
	border-bottom: 1px solid #CCC;
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
  margin-top: -1px;
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
	padding-top: 2px;
	padding-bottom: 2px;
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
	width: 100px;
	&:focus {
		outline: none;
	}
}
</style>

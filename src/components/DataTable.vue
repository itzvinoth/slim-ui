<template>
	<div v-if="data" class="data-table" tabindex="1">
		<div class="toolbar-header" v-if="toolbarHeader">
			<!-- Toolbar Header -->
			<h3>{{ toolbarHeaderText }}</h3>
		</div>
		<div class="toolbar" v-if="toolbar">
			<!-- Search -->
			<span class="search" v-if="search" :class="{'expand': isSearchExpaned }">
				<span class="icon icon-search"></span>
				<span class="clear icon icon-times" @click="clearSerachTerm" v-show="currentSearchTerm.length > 0"></span>
				<su-input ref="searchInput" type="search" class="search-input"
					:maxlength="15" :animate="false" :placeholder="customSearchPlaceHolder" v-model.trim="currentSearchTerm"
					@keyup.native.enter="doSearch(false)" @blur="onSearchBlur" @focus="onSearchFocus" @input="doDebounceFilterSearch"></su-input>
			</span>

			<!--Slot-->
			<slot name="toolbar-before"></slot>

			<!--Download csv-->
			<span class="download">
				<span class="download-csv link" v-if="downloadCsv" @click="doCSVDownload">
					<span class="icon icon-download"></span>Download
					<a ref="csvDownloadLink" class="hide download-link" href="#"></a>
				</span>
			</span>

			<!--Slot-->
			<slot name="toolbar-after" class="slot"></slot>
		</div>

		<table>
			<!-- Table header -->
			<thead v-if="tableHeaders">
				<tr>
					<th v-if="select && uid" class="select">
						<!-- <su-checkbox v-if="selectAll !== 'hide'" :indeterminate="isSelectAllIndeterminate"
							:disabled="selectAll === 'disable'" @input="handleSelectAll"></su-checkbox> -->
						<div :class="['su-checkbox-group', { 'indeterminate': this.isSelectAllIndeterminate }]">
							<input id="selectall" class="su-checkbox" type="checkbox" v-if="selectAll !== 'hide'"
								:disabled="selectAll === 'disable'" v-model="selectAllValue" @input="handleSelectAll">
							<label for="selectall" class="su-checkbox-label">
								<span class="su-checkbox-box"><span class="su-checkbox-tick"></span></span>
							</label>
						</div>
					</th>
					<!-- v-on is used here to bind only if conditions satisfy to avoid extra event binding -->
					<th v-for="(header, index) in tableHeaders" :key="index" :class="[header.class, header._style, { 'sortable': sort && header.sort, 'table-border': tableBorder && header.tableBorder }]"
						v-on="sort && header.sort ? { click: () => doSort(header) } : {}">
						<span v-tooltip="header.description" :title="header.description">
							{{ header.label || header.field }}
						</span>
						<!-- show up and down arrows in the header of the table -->
						<span v-if="header.sortArrow" :class="['arrow ' + ((header.arrowShowDefault) ? 'arrow-show' : '') +' arrow ' + (header._sortOrder === undefined ? 'desc' : header._sortOrder)]"></span>
					</th>
				</tr>
			</thead>

			<!-- Table body -->
			<tbody>
				<tr v-for="(row, index) in tableData" :key="(uid && row[uid]) || index" :data-uid="(uid && row[uid]) || index"
					:class="[row._style, { 'focused': focus && focusedRow && (row[uid] === focusedRow[uid]) }]"
					@click="handleRowClick(row, $event)" @mouseenter="handleMouseEnter(row, $event)" @mouseleave="handleMouseLeave(row, $event)">
					<!-- Hack to prevent row click from triggering select multiple times -->
					<td v-if="select && uid" class="select" @click.stop="() => {}">
						<!-- <su-checkbox v-model="selectedUIDs[row[uid]]"></su-checkbox> -->
						<div class="su-checkbox-group">
							<input :id="row[uid]" class="su-checkbox" type="checkbox" :disabled="row.disableSelect" v-model="selectedUIDs[row[uid]]" @change="handleSelectRow">
							<label :for="row[uid]" class="su-checkbox-label">
								<span class="su-checkbox-box"><span class="su-checkbox-tick"></span></span>
							</label>
						</div>
					</td>

					<slot :row="row" :index="index"></slot>
				</tr>

				<tr v-if="currentLimit > -1 && data.length > limit" class="show-all-row">
					<!-- Dummy select field -->
					<td v-if="select && uid"></td>
					<td :colspan="tableHeaders.length" class="show-all-col">
						<a href="" @click.prevent.stop="showAllRows">{{ showAllLabel }} ({{ data.length - currentLimit }} remaining items)</a>
					</td>
				</tr>
			</tbody>

			<!--Table footer-->
			<tfoot>
				<slot name="footer"></slot>
			</tfoot>
		</table>
	</div>
</template>

<script>
// Data should be list of objects
// Headers are defined seperately with headername and config like
// [{
//	class: [],
//  label: '',
//  field: '',
//  downloadField: '',
//  excludeDownload: ''
//  downloadLabel: ''
//  sortMethod: func
// },...]

// Things to do
// [x] Basic functionality (render table and class bindings for headers)
// [x] Sort
// [x] Search
// [x] CSV download
// [x] Limit rows
// [x] Select
// [x] Focus (tabbing)
// [ ] Context menu

import debounce from "lodash/debounce"

export default {
	name: "su-table",
	props: {
		// Data
		data: {
			required: true,
			type: Array,
			default: []
		},

		// Header config
		headers: {
			type: Array,
			default: null
		},

		// Unique id field (index is takes otherwise)
		uid: {
			type: String,
			default: null
		},

		// Enable/Disable toolbar (Enabled by default)
		toolbar: {
			type: Boolean,
			default: true
		},

		// Enable/Disable toolbar header (Disabled by default)
		toolbarHeader: {
			type: Boolean,
			default: false
		},

		// Include text string for the toolbar header (Empty by default)
		toolbarHeaderText: {
			type: String,
			default: ""
		},

		// Download (If String then taken as a download file name)
		downloadCsv: String || Boolean,

		// Sort (If String then taken as a default sort field with default sort order)
		sort: Boolean,

		// border (If String then taken as a default sort field with default sort order)
		tableBorder: Boolean,

		// Make rows focusable (to enable tabbing rows)
		focus: Boolean,

		// Enable selection.
		select: Boolean,
		// Accepted values
		// disable - Disable select all
		// hide - Hide select all
		selectAll: String,

		// Search
		search: Boolean,
		searchFilterOnly: {
			type: Boolean,
			default: true
		},
		searchPlaceHolder: {
			type: String,
			default: "Search table"
		},

		// Limits
		limit: {
			type: Number,
			default: -1 // Load all
		},
		showAllLabel: {
			type: String,
			default: "Show all rows"
		},

		// Callbacks
		rowEvents: Boolean,
		rowClick: Function,
		rowEnter: Function,
		rowLeave: Function,

		// on row focus keydown
		rowKeyDown: Function
	},
	data () {
		return {
			// Search term
			currentSearchTerm: "",
			isSearchExpaned: false,
			customSearchPlaceHolder: "Search",

			// Headers and data. Copy the values only
			tableHeaders: [],
			tableData: [],

			// Select
			selectedUIDs: {},
			selectAllValue: false,
			isSelectAllIndeterminate: false,

			// Limit
			currentLimit: this.limit,

			// Focus
			// Track current focsed row
			focusedRow: null
		}
	},
	created () {
		// Set data fields
		this.tableHeaders = this.$clone(this.headers)
		this.setData(this.data, this.currentLimit)

		// Non reactive vars goes here
		// Sort
		this.currentSortedHeader = null
		this.currentSearchFilterOnly = this.searchFilterOnly

		// Search
		this.searchableFields = this.tableHeaders.filter((i) => i.search).map((i) => i.field)
	},
	mounted () {
		// Add keyboard events
		if (this.focus) this.$el.addEventListener("keydown", this.handleKeyDown)
	},
	beforeDestroy () {
		// Remove keyboard events
		if (this.focus) this.$el.removeEventListener("keydown", this.handleKeyDown)

		// Hack to call select all with empty rows on destroy
		if (this.select) {
			this.selectAllValue = false
			this.handleSelectAll({
				target: {
					checked: false
				}
			})
		}
	},
	activated () {},
	deactivated () {
		// Hack to call select all with empty rows on destroy
		if (this.select) {
			this.selectAllValue = false
			this.handleSelectAll({
				target: {
					checked: false
				}
			})
		}
	},
	watch: {
		data (d) {
			this.setData(d, this.currentLimit)
		}
	},
	methods: {
		setData (d, limit) {
			if (limit === -1) {
				this.tableData = this.$clone(d)
			} else {
				this.tableData = this.$clone(d.slice(0, limit))
			}

			if (this.currentSortedHeader) this.doSort(this.currentSortedHeader, true)
			if (this.currentSearchTerm) this.doSearch(this.currentSearchFilterOnly)

			// If select if disabled then update it in UI
			let selected = {}
			for (let item of this.tableData) {
				let uid = (this.uid && item[this.uid])
				if (!item.disableSelect) {
					selected[uid] = this.selectedUIDs[uid]
				} else {
					selected[uid] = false
				}
			}

			this.selectedUIDs = selected
			this.$nextTick(() => this.emitSelectedEvent())
		},
		// On click outside table
		onClickOutside () {
			// Reset current focused row
			this.focusedRow = null
		},
		// ## Search
		// Clear search term
		clearSerachTerm () {
			this.currentSearchTerm = ""
			this.doSearch()
		},
		// Do things on search blur
		onSearchBlur () {
			if (!this.currentSearchTerm.length) {
				this.$nextTick(() => {
					this.isSearchExpaned = false
					this.customSearchPlaceHolder = "Search"
				})
			}
		},
		onSearchFocus () {
			this.$nextTick(() => {
				this.isSearchExpaned = true
				this.customSearchPlaceHolder = this.searchPlaceHolder
			})
		},
		// Add a debounce to search with filter on
		doDebounceFilterSearch: debounce(function (e) {
			this.doSearch(this.currentSearchFilterOnly)
		}, 200),
		// Filter data based on search
		doSearch (filterOnly) {
			this.currentSearchFilterOnly = filterOnly

			for (let row of this.tableData) {
				let found = false

				if (this.currentSearchTerm.length > 0) {
					for (let field of this.searchableFields) {
						let term = row[field].toString().toUpperCase()

						// Check if search term is found in given field
						if (term && term.indexOf(this.currentSearchTerm.toUpperCase()) !== -1) {
							found = true
							break
						}
					}
				} else {
					found = true
				}

				if (!row._style) this.$set(row, "_style", {})

				// For somereason normal update didn't work here even though the value is a primitive type
				// Will investigate
				// TODO
				this.$set(row, "_hide", !(found || filterOnly))
				this.$set(row._style, "search-term-present", found)
				this.$set(row._style, "search-term-absent", !found)
			}
		},
		// Sort/Filter
		doSort (header, preserveOrder) {
			// If order has to be preserved then skip sort order update
			if (!preserveOrder) {
				header._sortOrder = header._sortOrder === "asc" ? "desc" : "asc"
			} else if (!header._sortOrder) {
				// Set default sort order
				header._sortOrder = "asc"
			}

			this.tableData.sort((a, b) => {
				// Sort data by the custom sortData function given in column or default column get
				let fieldA = header.sortMethod && header.sortMethod(a) || a[header.field]
				let fieldB = header.sortMethod && header.sortMethod(b) || b[header.field]

				if (header._sortOrder === "asc") {
					if (fieldA < fieldB) return -1
					if (fieldA > fieldB) return 1
				} else {
					if (fieldA > fieldB) return -1
					if (fieldA < fieldB) return 1
				}

				return 0
			})

			for (let i of this.tableHeaders) {
				i._style = {
					"sortable": i.sort
				}
			}

			header._style = {
				"sortable": true,
				"sorted": true,
				[header._sortOrder]: true
			}

			this.currentSortedHeader = header
		},

				// ## Download options
		doCSVDownload () {
			let data = []

			// Push headers to the CSV row
			let fields = []
			for (let header of this.tableHeaders) {
				// Exclude the rows which are set to exclude
				if (header.excludeDownload === true) continue
				fields.push(header.downloadLabel || header.label || header.field)
			}
			data.push(fields)

			// Push the content row by row
			for (let row of this.tableData) {
				let fields = []

				for (let header of this.tableHeaders) {
					// Exclude the rows which are set to exclude
					if (header.excludeDownload === true) continue

					// If custom field is given for download specific then honor it else use default field
					let value = (header.downloadField && descendantGetterSetter(row, header.downloadField)) || row[header.field]

					if (value === undefined) value = ""
					fields.push(value)
				}
				data.push(fields)
			}

			// Concantanete all rows
			let csvContent = "data:text/csv;charset=utf-8,"
			data.forEach(function (dataArray, index) {
				let dataString = dataArray.join(",")
				csvContent += index < data.length ? dataString + "\n" : dataString
			})

			let encodedUri = encodeURI(csvContent)

			// Create dummy anchor tag
			let downloadFileName = this.downloadCsv || "download.csv"

			// Set encoded uri to link attribute
			this.$refs.csvDownloadLink.setAttribute("href", encodedUri)
			this.$refs.csvDownloadLink.setAttribute("download", downloadFileName)

			// Self click to download
			document.body.appendChild(this.$refs.csvDownloadLink)
			this.$refs.csvDownloadLink.click()
		},

		// Select
		handleSelectAll (val) {
			let selected = {}

			for (let item of this.tableData) {
				if (item.disableSelect) continue
				let uid = (this.uid && item[this.uid])
				selected[uid] = val.target.checked
			}

			this.selectedUIDs = selected
			this.$nextTick(() => this.emitSelectedEvent())
		},
		handleSelectRow (e) {
			if (!e.target.checked && this.selectAllValue) this.selectAllValue = false
			this.$nextTick(() => this.emitSelectedEvent())
		},
		emitSelectedEvent () {
			if (!this.rowEvents) return

			let results = []
			for (let i of this.tableData) {
				if (this.selectedUIDs[i[this.uid]]) {
					results.push(i)
				}
			}

			this.$emit("selected", results)
		},
		// LimitfindParentBySelector
		showAllRows () {
			this.currentLimit = -1
			this.setData(this.data, this.currentLimit)
		},
		handleRowClick (row, event) {
			this.focusedRow = row

			// Select the row on click
			if (this.select && !row.disableSelect) {
				let uid = (this.uid && row[this.uid])
				this.$set(this.selectedUIDs, uid, !this.selectedUIDs[uid])
				this.emitSelectedEvent()
			}

			// Click callback
			if (this.rowEvents) {
				this.$emit("rowClick", {
					row,
					event
				})
			}
		},
		scrollToFocusedRow () {
			if (!this.focusedRow) return
			let el = this.$el.querySelector("tr[data-uid='" + this.focusedRow[this.uid] + "']")
			if (el && el.scrollIntoView) el.scrollIntoView(false)
		},
		handleKeyDown (e) {
			if (this.focusedRow === null) return
			e.preventDefault()
			e.stopPropagation()

			// On space or enter select current focused row
			if (this.select && (e.keyCode === 13 || e.keyCode === 32)) {
				this.$set(this.selectedUIDs, this.focusedRow[this.uid], !this.selectedUIDs[this.focusedRow[this.uid]])
			}

			// On up arrow move one up
			// On down arrow move one down
			if (e.keyCode === 38 || e.keyCode === 40) {
				for (let i = 0; i < this.tableData.length; i++) {
					let prev = this.tableData[(i - 1) < 0 ? (this.tableData.length - 1) : i - 1]
					let next = this.tableData[(i + 1) > (this.tableData.length - 1) ? 0 : i + 1]

					if (this.focusedRow[this.uid] === this.tableData[i][this.uid]) {
						if (e.keyCode === 38) {
							this.focusedRow = prev
							this.$nextTick(() => this.scrollToFocusedRow())
							break
						}

						if (e.keyCode === 40) {
							this.focusedRow = next
							this.$nextTick(() => this.scrollToFocusedRow())
							break
						}
					}
				}
			}

			// Callback
			if (this.rowEvents) {
				this.$emit("rowKeyDown", {
					row: this.focusedRow,
					event: e
				})
			}
		},
		handleMouseEnter (row, event) {
			if (!this.rowEvents) return
			this.$emit("rowEnter", {
				row,
				event
			})
		},
		handleMouseLeave (row, event) {
			if (!this.rowEvents) return
			this.$emit("rowLeave", {
				row,
				event
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../styles/_common.scss";
.data-table {
	table {
		border-radius: 2px;
		background-color: #fff;
		border-radius: 2px;
		background-color: #fff;
		width: 100%;
		font-size: 14px;
	}
	th:hover {
        background: #fafafb;
    }
    th:hover .arrow {
        opacity: 1;
    }
    .arrow-show {
        opacity: 1;
        background: #fafafb;
    }

	th {
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	th,	td {
		// min-width: 120px;
		padding: 10px 20px;
	}

	td {
		text-transform: uppercase;
	}

	th.active .arrow {
		opacity: 1;
	}

	thead {
	    tr {
	        border-top: 1px solid #f1f1f1;
	    }
	    th:nth-child(1) {
	        background: #fafafb;
	    }
	    th {
	        cursor: pointer;
	        font-size: 0.85rem;
	        font-weight: 400;
	        color: #9b9b9b;
	    }
	    th:hover {
	        background: #fafafb;
	    }
	    th:hover .arrow {
	        opacity: 1;
	    }
	    .arrow-show {
	        opacity: 1;
	        background: #fafafb;
	    }
	    th:nth-child(1) {
	        // min-width: 150px;
	        text-align: left !important;
	        .arrow {
	            float: right !important;
	        }
	    }
	    th:nth-child(3) {
	        background: #FFF;
	        cursor: default;
	    }
	    th:nth-child(4) {
	        padding-right: 15px !important;
	        background: #FFF;
	        cursor: default;
	    }
	}

	.arrow {
        display: inline-block;
        float: left;
        position: relative;
        top: 7px;
        border: solid #9b9b9b;
        border-width: 0 1px 1px 0;
        padding: 3px;
        opacity: 0;
    }
    .arrow.asc {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
    }
    .arrow.desc {
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        top: 3px !important;
    }
}

</style>
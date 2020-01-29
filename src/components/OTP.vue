<template>
  <div id="otp-box" v-on:keyup="queryForKeywords" contenteditable="false" @paste="getPastedValue" :style="`height: ${boxHeight}px`">
    <input v-for="n in otplength" type="text" placeholder="○" v-model="otpvalues[n-1]" :name="'in'+n" :key="'in'+n" maxlength="1" class="otp-input" :style="`width: ${boxWidth}px`">
  </div>
</template>

<script>
let otpValues = []

export default {
  props: {
    otpLength: {
      type: Number,
      default: 4,
      required: true
    },
    otpValues: {
      type: Array,
      default: [],
      required: true
    },
    boxWidth: {
      type: Number,
      default: 32,
      required: false
    },
    boxHeight: {
      type: Number,
      default: 32,
      required: false
    }
  },
  data () {
    return {
      otplength: this.otpLength,
      otpvalues: this.otpValues
    }
  },
  mounted () {
    // create mouseup event for all child input elements...
    let inputFields = document.querySelectorAll(".otp-input")
    for (var i=0; i<inputFields.length; i++) {
      inputFields[i].addEventListener('keypress', this.isNumber)
      inputFields[i].addEventListener('focus', this.onFocus)
      inputFields[i].addEventListener('blur', this.onBlur)
    }
  },
  methods: {
    onFocus (evt) {
      let target = evt.target
      target.attributes["placeholder"].value = ''
    },
    onBlur (evt) {
      let target = evt.target
      target.attributes["placeholder"].value = '○'
    },
    getPastedValue (evt) {
      return false
    },
    isNumber (evt) {
      evt = (evt) ? evt : window.event
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault()
      }
    },
    queryForKeywords (evt) {
      let target = evt.srcElement
      let targetValue = target.value
      let maxLength = parseInt(target.attributes["maxlength"].value)
      let tl = targetValue.length

      let inputFields = document.querySelectorAll(".otp-input")
      for (var i=0; i<inputFields.length; i++) {
        if (!inputFields[i].value) {
          otpValues[i] = ""
        } else {
          otpValues[i] = inputFields[i].value
        }
      }
      this.$emit('update-otp', otpValues)

      if (evt.keyCode === 8) {
        let previous = target
        while (previous = previous.previousElementSibling) {
          if (previous.tagName.toLowerCase() === "input") {
            previous.select()
            previous.focus()
            break
          }
        }
      }
      if (tl >= maxLength) {
        let next = target
        while (next = next.nextElementSibling) {
          if (next.tagName.toLowerCase() === "input") {
            next.focus()
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#otp-box .otp-input.su-input-group {
  display: inline-block;
}
.otp-input::placeholder {
  font-size: 12px;
}
#otp-box input {
  text-align: center;
  height: 100%;
  box-sizing: border-box;
}
</style>

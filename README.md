# slim-ui

`slim-ui` is a simple vue components library contains needed UI elements. It was developed to solve [zerodha](https://zerodha.com/)'s application frontend needs and generic enough to use in any vue projects.

## Docs

- [📚Docs](https://slim-ui.github.io/)

# 🔧 Install

```bash
# npm
npm install slim-ui
```

```bash
# yarn
yarn add slim-ui
```

# 🔨 Usage

## Import individual components

```html
<su-button class="button button-blue">Primary</su-button>
<su-checkbox v-model="car" label="Car"></su-checkbox>
```

```js
import Vue from 'vue'
import { Button, Checkbox } from 'slim-ui'

export default {
    components: {
        'su-button': Button,
        'su-checkbox': Checkbox
    },
    data () {
        car: false
    }
}
```

## License
MIT


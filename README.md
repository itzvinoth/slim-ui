# slim-ui

`slim-ui` is a simple vue components library contains needed UI elements. It was developed to solve [zerodha](https://zerodha.com/)'s application frontend needs and generic enough to use in any vue projects.

# Install

Install `slim-ui` with the npm or yarn. It can work with webpack and ES2015 very well.

```bash
# npm
npm install slim-ui
```

```bash
# yarn
yarn add slim-ui
```

Install its peer dependencies.
```bash
# npm
npm install --save-dev node-sass sass-loader
```

```bash
# yarn
yarn add -D node-sass sass-loader
```

# Usage

### Use all components

```vue
import Vue from 'vue'
import SlimUI from 'slim-ui'

Vue.use(SlimUI)
```

### Or indiviual components
```vue
import Vue from 'vue'
import { Button } from 'slim-ui'

Vue.use(Button)
```

### Module Loader
This is the recommended way if your application uses vue-cli or has a webpack based build with vue-loader configured. Import the components as .vue files for seamless integration within your project where path of each component is available at the "import" section of a component documentation.

```vue
import { Button } from 'slim-ui';
```

In the next step, register the component with the tag name you'd like to use.

```vue
Vue.component('su-button', Button);
```

Then you'll be able to utilize the component in your application.

```template
<su-button class="button button-blue">Primary</su-button>
```

### Sample usage

```html
<div id="app">
  <su-button class="button button-blue">Primary</su-button>
</div>

<script>
import { Button } from 'slim-ui';

export default {
  components: {
    'su-button': Button
  }
}
</script>
```

## Documentation
SlimUI Docs are powered by VuePress and the source can be viewed [here](https://github.com/mevinoth/vp-docs).

## License
MIT

## Credits
Kailash ([@knadh](https://github.com/knadh)),
Vivek ([@vividvilla](https://github.com/vividvilla))

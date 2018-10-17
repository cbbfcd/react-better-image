# react-better-image

> A progressive image component with a better user experience.

[![NPM](https://img.shields.io/npm/v/react-better-image.svg)](https://www.npmjs.com/package/react-better-image) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-better-image
```

## Usage

[demo](https://cbbfcd.github.io/react-better-image/)

```jsx
import React, { Component } from 'react'

import BetterImage from 'react-better-image'

class Example extends Component {
  render () {
    return (
      <BetterImage
        source={'your source image url'}
        placeholder={'a loading component or a thumbnail image url, also can be a func like () => <Loading/>'}
        alt={'alt'}
        onload={(CurrentDOMElement) => {'img onload event, the current dom element be observed as param'}}
        enter={() => {'Image enters the viewable area'}}
        leave={() => {'Image leaves the viewable area'}}
        onlyEnter={false} // if true,will only emit the enter callback, leave function will not be called
        root={'default null, your viewable area target dom element'}
        rootMargin={'default "0px, 0px"'}
      />
    )
  }
}
```

## More

if you want to understand the implementation principle of this component. And the settings of root, rootMargin and other parameters.

please refer to --> [intersection-observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).


## License

MIT © [bobi](https://github.com/bobi)

# a mask with a new line
export default function test() {}

export function test() {}

## expected
```js
module.exports = function test() {}

module.exports.test = function test() {}
```
## exports
```js
[{ "default": "test" }]
```

# a second mask with a new line
export default function test() {}

export function test() {}

## expected
```js
module.exports = function test() {}

module.exports.test = function test() {}
```
## exports
```js
[{ "default": "test" }]
```
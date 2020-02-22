# single
export default function test() {}

## expected
```js
module.exports = function test() {}
```
## exports
```js
[{ "default": "test" }]
```

# multiple
export function test() {}
export function test2() {}

## expected
```js
module.exports.test = function test() {}
module.exports.test2 = function test() {}
```
## exports
```js
[{ "test": "test" }, { "test": "test2" }]
```
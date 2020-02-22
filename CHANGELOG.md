## 22 February 2020

### [2.6.0](https://github.com/contexttesting/mask/compare/v2.5.1...v2.6.0)

- [feature] Support normalising outputs in forks.
- [fix] Fix `\r\n` parsing.
- [ci] Add _Appveyor_.

## 4 February 2020

### [2.5.0](https://github.com/contexttesting/mask/compare/v2.4.2...v2.5.0)

- [feature] Read input as JS/JSON.
- [feature] Updates JSON properties.
- [fix] Updates empty expected.
- [fix] Fix extra whitespace in win input.

### [2.4.2](https://github.com/contexttesting/mask/compare/v2.4.1...v2.4.2)

- [fix] Try fix \r.

### [2.4.1](https://github.com/contexttesting/mask/compare/v2.4.0...v2.4.1)

- [fix] Upgrade for EOLs.
- [tests] Update tests to be robust against node versions.

## 30 January 2020

### [2.4.0](https://github.com/contexttesting/mask/compare/v2.3.0...v2.4.0)

- [feature] Pass multiple paths.
- [license] Update to Affero.
- [doc] Add `typedefs.json`.

## 5 September 2019

### [2.3.0](https://github.com/contexttesting/mask/compare/v2.2.0...v2.3.0)

- [doc] Improve _JSDoc_ annotations and externs.

## 3 May 2019

### [2.2.0](https://github.com/contexttesting/mask/compare/v2.1.1...v2.2.0)

- [feature] Allow to pass `jsProps`.

### [2.1.1](https://github.com/contexttesting/mask/compare/v2.1.0...v2.1.1)

- [fix] Put back types.

### [2.1.0](https://github.com/contexttesting/mask/compare/v2.0.4...v2.1.0)

- [package] Remove source maps from depack build and `src` directory from files to reduce size.

## 1 May 2019

### [2.0.4](https://github.com/contexttesting/mask/compare/v2.0.3...v2.0.4)

- [fix] Update mask properties correctly and account for preamble.
- [doc] Give titles to link types.
- [externs] `MaskConfig` is a structural interface now.

## 30 April 2019

### [2.0.3](https://github.com/contexttesting/mask/compare/v2.0.2...v2.0.3)

- [types] Put vendor types in the `index.js` file.

### [2.0.2](https://github.com/contexttesting/mask/compare/v2.0.1...v2.0.2)

- [types] Vendor `assert-diff` and `@zoroaster/fork` types.

### [2.0.1](https://github.com/contexttesting/mask/compare/v2.0.0...v2.0.1)

- [package] Publish types in the `files` field.

### [2.0.0](https://github.com/contexttesting/mask/compare/v1.6.0...v2.0.0)

- [build] Compile w/ [_Depack_](https://artdecocode.com/depack/).
- [deps] Move all dependencies to being dev-dependencies ^ because of _Depack_.
- [feature] Pass the mask result properties via the `this` and not in arguments.

## 23 April 2019

### [1.6.0](https://github.com/contexttesting/mask/compare/v1.5.0...v1.6.0)

- [feature] Handle errors in interactive mode by updating mask properties.

## 18 April 2019

### [1.5.0](https://github.com/contexttesting/mask/compare/v1.4.0...v1.5.0)

- [feature] Add preamble parsing (text on top of the result file will be available via `this.preamble` in masks).

## 11 April 2019

### [1.4.0](https://github.com/contexttesting/mask/compare/v1.3.0...v1.4.0)

- [feature] Support `propStartRe` and `propEndRe`.
- [deps] Update and unlock dependencies.

## 26 March 2019

### [1.3.0](https://github.com/contexttesting/mask/compare/v1.2.1...v1.3.0)

- [feature] Support focusing on masks.

## 20 March 2019

### [1.2.1](https://github.com/contexttesting/mask/compare/v1.2.0...v1.2.1)

- [fix] Asynchronous `assertResults`.
- [fix] Pass `this` context with props to `assertResults`.

## 16 March 2019

### 1.2.0

- [feature] Use `##` by default as the test separator in markdown files.
- [dep] Update `@zoroaster/fork` for new features (removing ANSI, pre-processing and removing the final `\n`).

## 15 March 2019

### 1.1.0

- [feature] Resolve the path to the mask result without extension.

### 1.0.2

- [fix] Don't print extensions in filenames in results.

### 1.0.1

- [deps] Update dependencies.

### 1.0.0

- Create `@zoroaster/mask` with [`mnp`](https://mnpjs.org)
- [repository]: `src`, `test`

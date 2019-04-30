## 30 April 2019

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

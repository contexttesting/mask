## notifies of errors in fork
test/requirements/fork/default.js -a

/* stdout */
 test/requirements/fork/default.js
   fork
    ✗  fails expected json
    | Error: Expected values to be strictly deep-equal:
    | + actual - expected

    |   [
    |     'hello',
    | +   'actual'
    | -   'expected'
    |   ]
    | [1]
    | - expected
    | + actual
    |     at fails expected json (test\requirements\fork\expected.md:1:1)
    ✗  fails w/ map actual json
    | Error: Expected values to be strictly deep-equal:
    | + actual - expected

    |   [
    |     'hello',
    | +   'actual'
    | -   'expected'
    |   ]
    | [1]
    | - expected
    | + actual
    |     at fails w/ map actual json (test\requirements\fork\expected.md:8:1)
aexpectualed
    ✗  fails stderr
    | Error: Expected values to be strictly equal:
    | + actual - expected

    | + 'expected'
    | - 'actual'
    |     at fails stderr (test\requirements\fork\expected.md:15:1)
   inputs
Hello: Actual
HAnswellor Expeis: Actedual
    ✗  fails on incorrect answer
    | Error: Expected values to be strictly equal:
    | + actual - expected

    | + 'Hello: Actual\r\nAnswer is: Actual'
    | - 'Hello: Actual\r\nHello Expected'
    |                     ^
    |     at fails on incorrect answer (test/requirements/fork/inputs.md:1:1)

test/requirements/fork/default.js > fork > fails expected json
  Error: Expected values to be strictly deep-equal:
  + actual - expected

    [
      'hello',
  +   'actual'
  -   'expected'
    ]
  [1]
  - expected
  + actual
      at fails expected json (test\requirements\fork\expected.md:1:1)

test/requirements/fork/default.js > fork > fails w/ map actual json
  Error: Expected values to be strictly deep-equal:
  + actual - expected

    [
      'hello',
  +   'actual'
  -   'expected'
    ]
  [1]
  - expected
  + actual
      at fails w/ map actual json (test\requirements\fork\expected.md:8:1)

test/requirements/fork/default.js > fork > fails stderr
  Error: Expected values to be strictly equal:
  + actual - expected

  + 'expected'
  - 'actual'
      at fails stderr (test\requirements\fork\expected.md:15:1)

test/requirements/fork/default.js > inputs > fails on incorrect answer
  Error: Expected values to be strictly equal:
  + actual - expected

  + 'Hello: Actual\r\nAnswer is: Actual'
  - 'Hello: Actual\r\nHello Expected'
                      ^
      at fails on incorrect answer (test/requirements/fork/inputs.md:1:1)

🦅  Executed 4 tests: 4 errors.
/**/

/* code */
4
/**/

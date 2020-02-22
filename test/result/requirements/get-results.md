## notifies of errors in get-results
test/requirements/get-results/default.js -a

/* stdout */
 test/requirements/get-results/default.js
   expected
hello world hello
    ✗  fails on strings
    | Error: 'hello world' == 'world hello'
    |     at fails on strings (test\requirements\get-results\expected.md:1:1)
   regex
input: hello world!
prop: world hello!
number: 130!
    ✗  a
    | Error: 'input: hello world!\nprop: world hello!\nnumber: 130!' == 'input: hello world\r\nprop: world hello\r\nnumber: 130'
    |     at a (test\requirements\get-results\regex.md:1:1)
input: hello world!
prop: world hello!
number: 130!
    ✗  b
    | Error: 'input: hello world!\nprop: world hello!\nnumber: 130!' == 'input: hello world\r\nprop: world hello\r\nnumber: 130'
    |     at b (test\requirements\get-results\regex.md:18:1)

test/requirements/get-results/default.js > expected > fails on strings
  Error: 'hello world' == 'world hello'
      at fails on strings (test\requirements\get-results\expected.md:1:1)

test/requirements/get-results/default.js > regex > a
  Error: 'input: hello world!\nprop: world hello!\nnumber: 130!' == 'input: hello world\r\nprop: world hello\r\nnumber: 130'
      at a (test\requirements\get-results\regex.md:1:1)

test/requirements/get-results/default.js > regex > b
  Error: 'input: hello world!\nprop: world hello!\nnumber: 130!' == 'input: hello world\r\nprop: world hello\r\nnumber: 130'
      at b (test\requirements\get-results\regex.md:18:1)

🦅  Executed 3 tests: 3 errors.
/**/

/* code */
3
/**/
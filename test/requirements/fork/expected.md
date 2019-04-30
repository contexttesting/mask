## fails expected json
hello actual

/* stdout */
["hello", "expected"]
/**/

## fails w/ map actual json
hello actual

/* expected */
["hello", "expected"]
/**/

## fails stderr
--

/* env */
{ "FORK_ENV": "expected" }
/**/

/* stderr */
actual
/**/
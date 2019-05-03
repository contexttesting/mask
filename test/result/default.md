## returns the correct output
test

/* expected */
test ok
/**/

## evaluates js and json props
test

/* json */
{ "hello": null }
/**/

/* js */
{ world: true }
/**/

/* expected */
test ok hello:null world:true
/**/
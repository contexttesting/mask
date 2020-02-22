## writes inputs
test

/* stdout */
Answer 1: input1
Answer 2: input2
/**/

## writes inputs without answers
test

/* stdout */
Answer 1: Answer 2:
/**/

/* stderr */
input1
input2
/**/

## writes inputs on stderr
test

/* stdout */
input1
/**/

/* stderr */
Answer 1: input1
/**/

## writes inputs from props
test

/* inputs */
Answer 1: input1
Answer 2: input2
/**/

/* stdout */
Answer 1: input1
Answer 2: input2
/**/
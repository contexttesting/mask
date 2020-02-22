## API

The package is available by importing its default function:

```js
import makeTestSuite from '@zoroaster/mask'
```

%~%

<include-typedefs>@zoroaster/fork</include-typedefs>

<typedef name="makeTestSuite">types/api.xml</typedef>

The exported test suite will be run with _Zoroaster_ Context-Testing Framework. The simplest form of a mask is to use the `getResults` property, which acts as a template for test cases, which will receive the inputs (e.g., `input`) from the mask result as properties of the `this` context, and the contexts via the arguments. The output will be compared to the `expected` property of the mask.

_For example, given the following function:_

%EXAMPLE: example/src%

_Zoroaster can test it using a mask:_

<table>
<tr><th>Mask</th><th>Mask Result</th></tr>
<tr><td>

%EXAMPLE: example/test/mask/default, ../../../src => @zoroaster/mask%
</td><td>

%EXAMPLE: example/test/result/default.md%
</td></tr>
</table>


<!-- %_FORK node_modules/zoroaster/depack/bin/zoroaster.js -a example/test/mask/default.js% -->

<fork>
  node_modules/zoroaster/depack/bin/zoroaster.js -a example/test/mask/default.js
</fork>

%~%

## Types

The following types are used to define the configuration of the mask.

<typedef>types/index.xml</typedef>

%~%
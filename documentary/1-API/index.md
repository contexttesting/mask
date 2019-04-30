## API

The package is available by importing its default function:

```js
import makeTestSuite from '@zoroaster/mask'
```

%~%

```## makeTestSuite
[
  ["result", "string"],
  ["config", "MakeTestSuiteConf"]
]
```

Creates a test suite that can be exported to run with _Zoroaster_ Context-Testing Framework.

_For example, given the following function:_

%EXAMPLE: example/src%

_Zoroastser can test it using a mask:_

%EXAMPLE: example/test/mask/default, ../../../src => @zoroaster/mask%
%FORK node_modules/.bin/zoroaster -a example/test/mask/default.js%

%~%

## Types

The following types are used to define the configuration of the mask.

%TYPEDEF types/index.xml%

%~%
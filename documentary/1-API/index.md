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

%TYPEDEF types/index.xml%

_For example, given the following function:_

%EXAMPLE: example/src/index.js%

_Zoroastser can test it using a mask:_

%EXAMPLE: example/test/mask/default.js, ../../../src => @zoroaster/mask%
%FORK node_modules/.bin/zoroaster -a example/test/mask/default.js%

%~%
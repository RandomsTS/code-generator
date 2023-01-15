## @randoms/code-generator package

A lightweight CLI to recursively include all file from a directory in a single source file.

- [Install on npm](https://www.npmjs.com/package/@randoms-pkg/code-generator)
- [Github Link](https://github.com/RandomsDev/code-generator)


## USAGE:-

- install package 

```command
  ~ npm i @randoms-pkg/code-generator
  # or
  ~ yarn add @randoms-pkg/code-generator 
```

```
import codeGenerator from '@randoms-pkg/code-generator';

codeGenerator.writeToFile ();
```

- Add ```randoms.config.json``` file in the root of the project

```json
{
  "target":  "./src",
  "include":  "^(?:[a-zA-Z0-9]+|\\[(?:\\.{3})?[a-zA-Z0-9]+\\])\\.js$",
  "outputDir": "./dist",
  "outputFile": "output.js"
}
```


# `OR`


- install package as a dev dependency 

```command
  ~ npm i @randoms-pkg/code-generator -D
  # or
  ~ yarn add @randoms-pkg/code-generator -D
```

- Add ```randoms.config.json``` file in the root of the project

```json
{
  "target":  "./src",
  "include":  "^(?:[a-zA-Z0-9]+|\\[(?:\\.{3})?[a-zA-Z0-9]+\\])\\.js$",
  "outputDir": "./dist",
  "outputFile": "output.js"
}
```

- Add CLI in scripts
```JSON
 "scripts": {
   "dev": "randoms-generator"
 },
```

- test
```bash 
  ~ npm run dev
  # or
  ~ yarn dev
```

#

---

## Docs

### Advance Usage

```json
{
  "target":  "./src",
  "include":  "^(?:[a-zA-Z0-9]+|\\[(?:\\.{3})?[a-zA-Z0-9]+\\])\\.js$",
  "outputDir": "./dist",
  "outputFile": "output.js",
  "preservedFiles": {
    "./_index.js":  ["getProps"],
    "./server/_server.js": ["getServerSideProps"]
  }
}
```

> randoms.config.json

|   Key       | DESCRIPTION          | 
|-------------|-------------|       
| target      | Target folder from where to include files **E.g** ```./src```             |       
| include     | determines which files to include in the target folder. **E.g** ```Regex Exp.```  |     
| outputDir   | Assign folder where to create output file. **E.g** ```./dist```                 | 
| outputFile  | output file name. **E.g** ```./output.js```  |
| preservedFiles   | ```Optional field!```                        |

**Preserved Files:-**

| Key 							  |  Expected named import |
|---------------------------------|---------------------------------------------------|
|  ```file relative path``` **E.g** ```./_index.js```   | arrays of expected import name **E.g** ```["getProps"]``` |

**Example:-**
```js
/// file: randoms.config.json
"preservedFiles": {
    "./_index.js":  ["getProps"]
}

/// file: output.js // outut file
const _ = require ("./index.js");
module.exports = {
	getProps: _.getProps,
} 

```

#

### **Sample Output file:-**

```js
// output.js

const _ = require ("./index.js");
const __ = require ("./products/apis/mine.js");
const ___ = require ("./products/index.js");
const ____ = require ("./products/products.js");
const _____ = require ("./products/store/index.js");
const ______ = require ("./server/_server.js");
const _______ = require ("./server.js");
const ________ = require ("./tester/index.js");
const _________ = require ("./[...index].js");
const __________ = require ("./_index.js");

module.exports = { 
    default: [_,__,___,____,_____,_______,________,_________],
    /* preserved exports */
    getServerSideProps: ______.getServerSideProps,
    getProps: __________.getProps
};
```


###

> [contribute to this project on Github](https://github.com/RandomsDev/code-generator)

<!-- about -->
<div align="center">
<h4 font-weight="bold">This repository is maintained by <a href="https://github.com/Zain-ul-din">Zain-Ul-Din</a></h4>
<p> Show some ❤️ by starring this awesome repository! </p>
</div>

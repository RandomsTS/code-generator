## @randoms/code-generator package

A lightweight package to recursively include all file from a directory in a single source file.

## USAGE:-

- install package as a dev dependency 
```command
~ npm i @randoms-pkg/code-generator -D
```

- Add ```randoms.config.json``` file in the root of the project

```json
{
  "target": "./test",
  "include": "^(?:[a-zA-Z0-9]+|\\[(?:\\.{3})?[a-zA-Z0-9]+\\])\\.js$",
  "outputDir": "./dist",
  "outputFile": "main.js"
}
```

- Add CLI in scripts
```JSON
 "scripts": {
   "dev": "code-generator"
 },
```

###

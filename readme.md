## @randoms/code-generator package

A lightweight package to recursively include all file from a directory in a single source file.

## USAGE:-

- install package as a dev dependency 

```command
  ~ npm i @randoms-pkg/code-generator -D
  # or
  ~ yarn add @randoms-pkg/code-generator -D
```

- Add ```randoms.config.json``` file in the root of the project

```json
{
  "target": "./src",
  "include": "^(?:[a-zA-Z0-9]+|\\[(?:\\.{3})?[a-zA-Z0-9]+\\])\\.js$",
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

###

<!-- about -->
<div align="center">
<h4 font-weight="bold">This repository is maintained by <a href="https://github.com/Zain-ul-din">Zain-Ul-Din</a></h4>
<p> Show some ❤️ by starring this awesome repository! </p>
</div>
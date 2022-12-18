#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("./util/file-util");
var fileContent = "";
let idx = 0;
const config = (0, file_util_1.readConfigFile)();
(0, file_util_1.validateConfigObject)(config);
const fileMatchRegex = new RegExp(config.include);
(0, file_util_1.createDir)(config.outputDir);
(0, file_util_1.readDirectory)(config.target, (file) => {
    if (fileMatchRegex.test(file.fileName)) {
        idx += 1;
        let varName = "";
        for (let i = 0; i < idx; i++)
            varName += "_";
        fileContent += `const ${varName} = require ("${file.filePath.replace(config.target, ".")}");\n`;
    }
});
(0, file_util_1.writeFile)(config.outputDir + "/" + config.outputFile, fileContent);
console.log("Done");

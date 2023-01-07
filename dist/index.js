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
let defaultExports = [];
let preservedFilesExpots = [];
let foundPreservedFiles = [];
const relativePath = (0, file_util_1.getRelativePath)(config.outputDir, config.target);
(0, file_util_1.readDirectory)(config.target, (file) => {
    idx += 1;
    let varName = "";
    for (let i = 0; i < idx; i++)
        varName += "_";
    const fileRelaitvePath = file.filePath.replace(config.target, ".").replace(".", "");
    if (config.preservedFiles
        &&
            Object.keys(config.preservedFiles).includes(relativePath + fileRelaitvePath)) {
        fileContent += `const ${varName} = require ("${relativePath + fileRelaitvePath}");\n`;
        if (config.preservedFiles[relativePath + fileMatchRegex] == undefined)
            throw new Error(`Incorrect path to ${fileRelaitvePath} did you means? \n ${relativePath + fileRelaitvePath}`);
        config.preservedFiles[relativePath + fileMatchRegex].forEach((prevedExport) => {
            preservedFilesExpots.push(`    ${prevedExport}: ${varName}.${prevedExport}`);
        });
        foundPreservedFiles.push(relativePath + fileRelaitvePath);
    }
    else if (fileMatchRegex.test(file.fileName)) {
        fileContent += `const ${varName} = require ("${relativePath}${fileRelaitvePath}");\n`;
        defaultExports.push(varName);
    }
});
if (config.preservedFiles) {
    Object.keys(config.preservedFiles).forEach((key) => {
        if (!foundPreservedFiles.includes(key)) {
            if (config.preservedFiles[key].forEach == undefined)
                throw new Error(`
                preserved files object values must be an Array
                did you means?
                    "${key}": ["${config.preservedFiles[key]}"]
            `);
            config.preservedFiles[key].forEach((prevedExport) => {
                preservedFilesExpots.push(`    ${prevedExport}: undefined `);
            });
        }
    });
}
(0, file_util_1.writeFile)(config.outputDir + "/" + config.outputFile, `${fileContent}
module.exports = { 
    default: [${defaultExports.join(",")}],\n    /* preserved exports */
${preservedFilesExpots.join(",\n")}
};
`);

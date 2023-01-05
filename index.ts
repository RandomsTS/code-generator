#! /usr/bin/env node
import { 
    readDirectory,
    readConfigFile,
    validateConfigObject,
    createDir,
    writeFile,
    getRelativePath
} from './util/file-util';
import type { RandomsConfig } from './types/util-types';

var fileContent: string = "";
let idx: number = 0;

const config = readConfigFile () as RandomsConfig;
validateConfigObject (config);
const fileMatchRegex = new RegExp (config.include);

createDir (config.outputDir);

let defaultExports: Array<string> = [];
let preservedFilesExpots: Array<string> = [];
let foundPreservedFiles: Array <string> = [] 

const relativePath = getRelativePath (config.outputDir, config.target);
console.log (relativePath);

readDirectory (config.target, (file)  =>  {

    idx += 1;
    let varName: string = "";
    for (let i = 0; i < idx; i++) varName += "_"; 
    
    const fileRelaitvePath = file.filePath.replace (config.target, ".").replace (".", "");

    if (config.preservedFiles && Object.keys (config.preservedFiles).includes(fileRelaitvePath)) 
    {
        fileContent += `const ${varName} = require ("${fileRelaitvePath}");\n`;
        config.preservedFiles[fileRelaitvePath].forEach ((prevedExport: string) => {
            preservedFilesExpots.push(`    ${prevedExport}: ${varName}.${prevedExport}`);
        });
        foundPreservedFiles.push (fileRelaitvePath);
    }
    else if (fileMatchRegex.test (file.fileName)) 
    {
        fileContent += `const ${varName} = require ("${relativePath}${fileRelaitvePath}");\n`;
        defaultExports.push (varName);
    }
});

Object.keys (config.preservedFiles).forEach ((key: string) => {
    if (!foundPreservedFiles.includes (key)) {
        config.preservedFiles[key].forEach ((prevedExport: string) => {
            preservedFilesExpots.push(`    ${prevedExport}: undefined `);
        });
    }
});

writeFile (config.outputDir + "/" + config.outputFile, 
`${fileContent}
module.exports = { 
    default: [${defaultExports.join (",")}],\n    /* preserved exports */
${preservedFilesExpots.join (",\n")}
};
`);



#! /usr/bin/env node
import { readDirectory, readConfigFile, validateConfigObject, createDir, writeFile } from './util/file-util';
import type { RandomsConfig } from './types/util-types';

var fileContent: string = "";
let idx: number = 0;

const config = readConfigFile () as RandomsConfig;
validateConfigObject (config);
const fileMatchRegex = new RegExp (config.include);

createDir (config.outputDir);


readDirectory (config.target, (file)=>  {
    if (fileMatchRegex.test (file.fileName)) 
    {
        idx += 1;
        let varName: string = "";
        for (let i = 0; i < idx; i++) varName += "_"; 
        fileContent += `const ${varName} = require ("${file.filePath.replace (config.target, ".")}");\n`;
    }
})

writeFile (config.outputDir + "/" + config.outputFile, fileContent);


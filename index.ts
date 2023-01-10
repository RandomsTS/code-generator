import { 
    readDirectory,
    readConfigFile,
    validateConfigObject,
    createDir,
    writeFile,
    getRelativePath
} from './util/file-util';
import { helperText } from './util/CONSTANTS';
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

readDirectory (config.target, (file)  =>  {

    idx += 1;
    let varName: string = "";
    for (let i = 0; i < idx; i++) varName += "_"; 
    
    let fileRelaitvePath = file.filePath.replace (config.target, ".").replace (".", "");

    if (
        config.preservedFiles 
        &&
        (Object.keys (config.preservedFiles)
        .filter ((path) =>{
            if (path.startsWith (".") && !fileMatchRegex.test (file.fileName)) 
                fileRelaitvePath = `.${fileRelaitvePath}`;
            return fileRelaitvePath === path; 
        }).length > 0)
    ) 
    {
        fileContent += `const ${varName} = require ("${relativePath+fileRelaitvePath.replace (".","")}");\n`;   
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

if (config.preservedFiles) {
    Object.keys (config.preservedFiles).forEach ((key: string) => {
        if (!foundPreservedFiles.includes (key)) {
            if (config.preservedFiles[key].forEach == undefined) throw new Error (`
                preserved files object values must be an Array
                did you means?
                    "${key}": ["${config.preservedFiles[key]}"]
                ${helperText}    
            `);
            config.preservedFiles[key].forEach ((prevedExport: string) => {
                preservedFilesExpots.push(`    ${prevedExport}: undefined `);
            });
        }
    });
}


writeFile (config.outputDir + "/" + config.outputFile, 
`${fileContent}
module.exports = { 
    default: [${defaultExports.join (",")}],\n    /* preserved exports */
${preservedFilesExpots.join (",\n")}
};
`);



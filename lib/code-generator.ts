import FileUtil from '../util/file-util';
import RandomsUtil from '../util/randoms-util';
import { helperText } from '../util/CONSTANTS';
import type { RandomsConfig } from '../types/util-types';

export default class CodeGenerator 
{
    /**
     * @param config `RandomsConfig`
    */
    public constructor () {
        // reads config
        this.config = RandomsUtil.readConfigFile () as RandomsConfig;
        RandomsUtil.validateConfigObject (this.config);
        
        this.fileMatchRegex = new RegExp (this.config.include);

        // creates output file
        FileUtil.createDir (this.config.outputDir);

        // get relative path
        this.relativePath = FileUtil.getRelativePath (this.config.outputDir, this.config.target);
        
        // reads directory
        this.readDir ();
        
        // adds preserved files those not found in directory
        this.addNotFoundPresevedFile();
    }
    

    /**
     * writes content to file 
    */
    public writeToFile () : void
    {
        FileUtil.writeFile (this.config.outputDir + "/" + this.config.outputFile, 
        `${this.fileContent}
        module.exports = { 
            default: [${this.defaultExports.join (",")}],\n    /* preserved exports */
        ${this.preservedFilesExpots.join (",\n")}
        };
        `);
    }

    public defaultExports:       Array<string>  = [];
    public preservedFilesExpots: Array<string>  = [];
    public foundPreservedFiles:  Array <string> = [];

    private fileMatchRegex: RegExp
    private config:RandomsConfig
    private relativePath:string
    private fileContent:string = ''
    

    /**
     * reads directory and finds file exports
    */
    private readDir (): void
    {
        let idx = 0;
        FileUtil.readDirectory (this.config.target, (file)  =>  {

            idx += 1;
            let varName: string = "";
            for (let i = 0; i < idx; i++) varName += "_"; 
            
            let fileRelaitvePath = file.filePath.replace (this.config.target, ".").replace (".", "");
        
            if (
                this.config.preservedFiles 
                &&
                (Object.keys (this.config.preservedFiles)
                .filter ((path) =>{
                    if (path.startsWith (".") && !this.fileMatchRegex.test (file.fileName)) 
                        fileRelaitvePath = `.${fileRelaitvePath}`;
                    return fileRelaitvePath === path; 
                }).length > 0)
            ) 
            {
                this.fileContent += `const ${varName} = require ("${this.relativePath+fileRelaitvePath.replace (".","")}");\n`;   
                this.config.preservedFiles[fileRelaitvePath].forEach ((prevedExport: string) => {
                    this.preservedFilesExpots.push(`    ${prevedExport}: ${varName}.${prevedExport}`);
                });
                this.foundPreservedFiles.push (fileRelaitvePath);
            }
            else if (this.fileMatchRegex.test (file.fileName)) 
            {
                this.fileContent += `const ${varName} = require ("${this.relativePath}${fileRelaitvePath}");\n`;
                this.defaultExports.push (varName);
            }
        });
    }

    /**
     * adds undefined at the place of missing preserved files
    */
    private addNotFoundPresevedFile () :void
    {
        if (this.config.preservedFiles) {
            Object.keys (this.config.preservedFiles).forEach ((key: string) => {
                if (!this.foundPreservedFiles.includes (key)) {
                    if (this.config.preservedFiles[key].forEach == undefined) throw new Error (`
                        preserved files object values must be an Array
                        did you means?
                            "${key}": ["${this.config.preservedFiles[key]}"]
                        ${helperText}    
                    `);
                    this.config.preservedFiles[key].forEach ((prevedExport: string) => {
                        this.preservedFilesExpots.push(`    ${prevedExport}: undefined `);
                    });
                }
            });
        }
    }
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = __importDefault(require("../util/file-util"));
const randoms_util_1 = __importDefault(require("../util/randoms-util"));
const CONSTANTS_1 = require("../util/CONSTANTS");
class CodeGenerator {
    /**
     * @param config `RandomsConfig`
    */
    constructor() {
        // reads config
        this.config = randoms_util_1.default.readConfigFile();
        randoms_util_1.default.validateConfigObject(this.config);
        this.fileMatchRegex = new RegExp(this.config.include);
        // creates output file
        file_util_1.default.createDir(this.config.outputDir);
        // get relative path
        this.relativePath = file_util_1.default.getRelativePath(this.config.outputDir, this.config.target);
        // reads directory
        this.readDir();
        // adds preserved files those not found in directory
        this.addNotFoundPresevedFile();
    }
    /**
     * writes content to file
    */
    writeToFile() {
        file_util_1.default.writeFile(this.config.outputDir + "/" + this.config.outputFile, `${this.fileContent}\nmodule.exports = {\n  default: [${this.defaultExports.join(",")}],\n    /* preserved exports */\n    ${this.preservedFilesExpots.join(",\n")}\n};`);
    }
    defaultExports = [];
    preservedFilesExpots = [];
    foundPreservedFiles = [];
    fileMatchRegex;
    config;
    relativePath;
    fileContent = '';
    /**
     * reads directory and finds file exports
    */
    readDir() {
        let idx = 0;
        file_util_1.default.readDirectory(this.config.target, (file) => {
            idx += 1;
            let varName = "";
            for (let i = 0; i < idx; i++)
                varName += "_";
            let fileRelaitvePath = file.filePath.replace(this.config.target, ".").replace(".", "");
            if (this.config.preservedFiles
                &&
                    (Object.keys(this.config.preservedFiles)
                        .filter((path) => {
                        if (path.startsWith(".") && !this.fileMatchRegex.test(file.fileName))
                            fileRelaitvePath = `.${fileRelaitvePath}`;
                        return fileRelaitvePath === path;
                    }).length > 0)) {
                this.fileContent += `const ${varName} = require ("${this.relativePath + fileRelaitvePath.replace(".", "")}");\n`;
                this.config.preservedFiles[fileRelaitvePath].forEach((prevedExport) => {
                    this.preservedFilesExpots.push(`    ${prevedExport}: ${varName}.${prevedExport}`);
                });
                this.foundPreservedFiles.push(fileRelaitvePath);
            }
            else if (this.fileMatchRegex.test(file.fileName)) {
                this.fileContent += `const ${varName} = require ("${this.relativePath}${fileRelaitvePath}");\n`;
                this.defaultExports.push(varName);
            }
        });
    }
    /**
     * adds undefined at the place of missing preserved files
    */
    addNotFoundPresevedFile() {
        if (this.config.preservedFiles) {
            Object.keys(this.config.preservedFiles).forEach((key) => {
                if (!this.foundPreservedFiles.includes(key)) {
                    if (this.config.preservedFiles[key].forEach == undefined)
                        throw new Error(`
                        preserved files object values must be an Array
                        did you means?
                            "${key}": ["${this.config.preservedFiles[key]}"]
                        ${CONSTANTS_1.helperText}    
                    `);
                    this.config.preservedFiles[key].forEach((prevedExport) => {
                        this.preservedFilesExpots.push(`    ${prevedExport}: undefined `);
                    });
                }
            });
        }
    }
}
exports.default = CodeGenerator;

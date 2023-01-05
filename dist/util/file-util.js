"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativePath = exports.writeFile = exports.createDir = exports.validateConfigObject = exports.readConfigFile = exports.readDirectory = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
function isFolder(path) {
    return (0, fs_1.lstatSync)(path).isDirectory();
}
// reads whole directory
function readDirectory(root, callBack) {
    if (!(isFolder(root))) {
        callBack({ fileName: (0, path_1.basename)(root), filePath: root.replaceAll("\\", "/") });
        return;
    }
    const files = (0, fs_1.readdirSync)(root);
    for (var file of files)
        readDirectory(root + "\\" + file, callBack);
}
exports.readDirectory = readDirectory;
// reads config file
function readConfigFile() {
    const configFilePath = process.cwd() + "\\randoms.config.json";
    let config = {};
    try {
        config = JSON.parse((0, fs_1.readFileSync)(configFilePath.replaceAll("\\", "/"), "utf-8"));
    }
    catch (error) {
        throw new Error("can't read randoms.config.json");
    }
    return config;
}
exports.readConfigFile = readConfigFile;
// validates config file
function validateConfigObject(config) {
    const requiredKeys = ["target", "include", "outputDir", "outputFile"];
    const missingKeys = requiredKeys.filter(key => !(key in config));
    if (missingKeys.length > 0)
        throw new Error(`Missing required keys: ${missingKeys.join(", ")}`);
}
exports.validateConfigObject = validateConfigObject;
// creates directory if it doesn't exist
async function createDir(path) {
    if ((0, fs_1.existsSync)(path))
        return;
    try {
        await (0, promises_1.mkdir)(path, { recursive: true });
    }
    catch (error) {
        console.log(error);
    }
}
exports.createDir = createDir;
//  writes to file
async function writeFile(path, fileContent) {
    (0, fs_1.writeFileSync)(path, fileContent, "utf-8");
}
exports.writeFile = writeFile;
// returns relative path btw path a to b
function getRelativePath(from, to) {
    const fromPath = (0, path_1.resolve)(from);
    const toPath = (0, path_1.resolve)(to);
    const relativePath = (0, path_1.relative)(fromPath, toPath).replaceAll("\\", "/");
    if (relativePath == "")
        return ".";
    if (!relativePath.startsWith(".."))
        return "./" + relativePath;
    if (to.includes((0, path_1.basename)(relativePath)))
        return "./" + relativePath;
    const baseName = (0, path_1.basename)(to);
    return "./" + relativePath + "/" + (baseName == "." ? "" : baseName + "/");
}
exports.getRelativePath = getRelativePath;

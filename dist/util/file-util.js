"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfigFile = exports.readDirectory = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
async function isFolder(path) {
    return (await (0, promises_1.lstat)(path)).isDirectory();
}
// reads whole directory
async function readDirectory(root, callBack) {
    if (!(await isFolder(root))) {
        callBack({ fileName: (0, path_1.basename)(root), filePath: root.replaceAll("\\", "/") });
        return;
    }
    const files = await (0, promises_1.readdir)(root);
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
/*
    /^[a-zA-Z][a-zA-Z0-9]*\.js$/.test(file.fileName) ||
    /\[(.+)\].js/.test    (file.fileName) ||
    /\[\.{3}.+\].js/.test (file.fileName)
*/ 

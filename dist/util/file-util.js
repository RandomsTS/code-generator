"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirectory = void 0;
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

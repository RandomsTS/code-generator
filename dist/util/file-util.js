"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
class FileUtil {
    /**
     * returns path is folder path
     * @param path
     * @returns Boolean
    */
    static isFolder(path) {
        const splitPath = path.split("/");
        let isDirectory = !splitPath.at(splitPath.length - 1)?.startsWith(".") &&
            !splitPath.at(splitPath.length - 1)?.includes(".");
        if (isDirectory)
            return (0, fs_1.lstatSync)(path + path.endsWith("/") ? "" : "/").isDirectory();
        return (0, fs_1.lstatSync)(path).isDirectory();
    }
    /**
     * Iterate whole directory recursively
     * @param root root path
     * @param callBack ```(metaData:FileMetaData)=>void```
     * @returns void
    */
    static readDirectory(root, callBack) {
        if (!(FileUtil.isFolder(root))) {
            callBack({ fileName: (0, path_1.basename)(root), filePath: root.replaceAll("\\", "/") });
            return;
        }
        const files = (0, fs_1.readdirSync)(root);
        for (var file of files)
            FileUtil.readDirectory(root + "/" + file, callBack);
    }
    /**
     *  create directory on given path
     *  @param path `string`
     *  @returns `Promise<void>`
    */
    static async createDir(path) {
        if ((0, fs_1.existsSync)(path))
            return;
        try {
            await (0, promises_1.mkdir)(path, { recursive: true });
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * write content to file
     * @param path file path
     * @param fileContent file content
     * @returns `Promise<void>`
     */
    static async writeFile(path, fileContent) {
        (0, fs_1.writeFileSync)(path, fileContent, "utf-8");
    }
    /**
     * returns relative path from path a to path b
     * @param from path
     * @param to path
     * @returns relative path `string`
    */
    static getRelativePath(from, to) {
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
}
exports.default = FileUtil;

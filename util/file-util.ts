import { lstatSync, readdirSync, existsSync, writeFileSync } from "fs";
import {  mkdir } from "fs/promises";
import { basename, resolve, relative } from "path";
import type { FileMetaData } from "../types/util-types";

export default class FileUtil 
{   
    
    /** 
     * returns path is folder path
     * @param path 
     * @returns Boolean   
    */
    private static isFolder(path: string): Boolean  
    {
        return lstatSync(path).isDirectory();
    }
    
    /**
     * Iterate whole directory recursively
     * @param root root path
     * @param callBack ```(metaData:FileMetaData)=>void```
     * @returns void
    */
    public static readDirectory(root: string, callBack: (metaData:FileMetaData)=> void): void
    {
        if (!(FileUtil.isFolder(root))) { 
    		callBack({ fileName: basename (root), filePath: root.replaceAll ("\\", "/")});
    		return; 
    	}

        const files: string[] = readdirSync(root);
        for (var file of files)	FileUtil.readDirectory(root + "/" + file, callBack);
    }

    /**
     *  create directory on given path
     *  @param path `string`
     *  @returns `Promise<void>`
    */
    public static async createDir (path:string): Promise<void>
    {
        if (existsSync (path)) return;
        try { await mkdir (path, { recursive: true }) } catch (error) 
        {console.log (error)}
    }

    /**
     * write content to file
     * @param path file path
     * @param fileContent file content
     * @returns `Promise<void>`
     */
    public static async writeFile (path:string, fileContent: string): Promise<void> 
    {
        writeFileSync (path, fileContent, "utf-8")
    }

    /** 
     * returns relative path from path a to path b
     * @param from path
     * @param to path
     * @returns relative path `string`
    */
    public static getRelativePath (from: string, to:string): string {
        const fromPath = resolve (from);
        const toPath   = resolve (to);
        const relativePath = relative (fromPath, toPath).replaceAll ("\\", "/");
        if (relativePath == "") return ".";
        if (!relativePath.startsWith ("..")) return "./" + relativePath;
        if (to.includes(basename (relativePath))) return "./" + relativePath;
        const baseName = basename (to);
        return "./" + relativePath + "/" + (baseName == "." ? "" : baseName + "/");
    }
}



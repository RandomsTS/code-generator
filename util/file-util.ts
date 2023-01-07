import { lstatSync, readdirSync, readFileSync, existsSync, writeFileSync } from "fs";
import {  mkdir } from "fs/promises";
import { basename, resolve, relative } from "path";
import type { FileMetaData } from "../types/util-types";
import { helperText } from "./CONSTANTS";

function isFolder(path: string): Boolean  {
    return lstatSync(path).isDirectory();
}

// reads whole directory
export function readDirectory(root: string, callBack: (metaData:FileMetaData)=> void): void
{
    if (!(isFolder(root))) { 
		callBack({ fileName: basename (root), filePath: root.replaceAll ("\\", "/")});
		return; 
	}
    
    const files: string[] = readdirSync(root);
    for (var file of files)	readDirectory(root + "/" + file, callBack);
}

// reads config file
export function readConfigFile ():  any
{
    const configFilePath: string = process.cwd () + "\\randoms.config.json";
    let config: any = {};
    try {   config = JSON.parse(readFileSync (configFilePath.replaceAll ("\\", "/"), "utf-8")) } 
    catch (error) { 
        throw new Error (`
            can't read randoms.config.json
            ${helperText}
        `)  
    }
    return config
}

// validates config file
export function validateConfigObject (config: any): void
{
    const requiredKeys = ["target", "include", "outputDir", "outputFile"];
    const missingKeys = requiredKeys.filter(key => !(key in config));
    if (missingKeys.length > 0) throw new Error(`Missing required keys: ${missingKeys.join(", ")} \n ${helperText}`);
}

// creates directory if it doesn't exist
export async function createDir (path:string): Promise<void>
{
    if (existsSync (path)) return;
    try { await mkdir (path, { recursive: true }) } catch (error) 
    {console.log (error)}
}

//  writes to file
export async function writeFile (path:string, fileContent: string): Promise<void> 
{
    writeFileSync (path, fileContent, "utf-8")
}

// returns relative path btw path a to b
export function getRelativePath (from: string, to:string): string {
    const fromPath = resolve (from);
    const toPath   = resolve (to);
    const relativePath = relative (fromPath, toPath).replaceAll ("\\", "/");
    if (relativePath == "") return ".";
    if (!relativePath.startsWith ("..")) return "./" + relativePath;
    if (to.includes(basename (relativePath))) return "./" + relativePath;
    const baseName = basename (to);
    return "./" + relativePath + "/" + (baseName == "." ? "" : baseName + "/");
}


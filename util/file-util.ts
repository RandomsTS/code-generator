import { readFileSync } from "fs";
import { readdir, lstat } from "fs/promises";
import { basename } from "path";
import type { FileMetaData } from "../types/util-types";

async function isFolder(path: string): Promise<boolean> {
    return (await lstat(path)).isDirectory();
}

// reads whole directory
export async function readDirectory(root: string, callBack: (metaData:FileMetaData)=> void): Promise<void> 
{
    if (!(await isFolder(root))) { 
		callBack({ fileName: basename (root), filePath: root.replaceAll ("\\", "/")});
		return; 
	}
    
    const files: string[] = await readdir(root);
    for (var file of files)	readDirectory(root + "\\" + file, callBack);
}

// reads config file
export function readConfigFile ():  any
{
    const configFilePath: string = process.cwd () + "\\randoms.config.json";
    let config: any = {};
    try {   config = JSON.parse(readFileSync (configFilePath.replaceAll ("\\", "/"), "utf-8")) } 
    catch (error) { throw new Error ("can't read randoms.config.json")  }
    return config
}

// validates config file
export function validateConfigObject (config: any): void
{
    const requiredKeys = ["target", "include", "outputDir", "outputFile"];
    const missingKeys = requiredKeys.filter(key => !(key in config));
    if (missingKeys.length > 0) throw new Error(`Missing required keys: ${missingKeys.join(", ")}`);
}

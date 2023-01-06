import { readFileSync } from "fs";
import { helperText } from "./CONSTANTS";

export default class RandomsUtil 
{
    /**
     * reads ```randoms.config.json``` file
     * @throws {Error} if ```randoms.config.json``` not found.  
     * @returns JSON
    */
    public static readConfigFile ():  any
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
    
    /**
     * validates `randoms.config.json` file required entries
     * @throws {Error} if `["target", "include", "outputDir", "outputFile"]` any of keys missing
     * @param config 
     */
    public static validateConfigObject (config: any): void
    {
        const requiredKeys = ["target", "include", "outputDir", "outputFile"];
        const missingKeys = requiredKeys.filter(key => !(key in config));
        if (missingKeys.length > 0) throw new Error(`Missing required keys: ${missingKeys.join(", ")} \n ${helperText}`);
    }

}
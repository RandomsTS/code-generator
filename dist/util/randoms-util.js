"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const CONSTANTS_1 = require("./CONSTANTS");
class RandomsUtil {
    /**
     * reads ```randoms.config.json``` file
     * @throws {Error} if ```randoms.config.json``` not found.
     * @returns JSON
    */
    static readConfigFile() {
        const configFilePath = process.cwd() + "\\randoms.config.json";
        let config = {};
        try {
            config = JSON.parse((0, fs_1.readFileSync)(configFilePath.replaceAll("\\", "/"), "utf-8"));
        }
        catch (error) {
            throw new Error(`
                can't read randoms.config.json
                ${CONSTANTS_1.helperText}
            `);
        }
        return config;
    }
    /**
     * validates `randoms.config.json` file required entries
     * @throws {Error} if `["target", "include", "outputDir", "outputFile"]` any of keys missing
     * @param config
     */
    static validateConfigObject(config) {
        const requiredKeys = ["target", "include", "outputDir", "outputFile"];
        const missingKeys = requiredKeys.filter(key => !(key in config));
        if (missingKeys.length > 0)
            throw new Error(`Missing required keys: ${missingKeys.join(", ")} \n ${CONSTANTS_1.helperText}`);
    }
}
exports.default = RandomsUtil;

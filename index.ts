#! /usr/bin/env node
import { readDirectory, readConfigFile } from './util/file-util';
import type { RandomsConfig } from './types/util-types';

const config = readConfigFile () as RandomsConfig;
const fileMatchRegex = new RegExp (config.include);


readDirectory (config.target, (file)=>{
    if (fileMatchRegex.test (file.fileName))
    {
        // valid file
        console.log (file.filePath);
    }
})






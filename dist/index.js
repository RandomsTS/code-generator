#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("./util/file-util");
const config = (0, file_util_1.readConfigFile)();
const fileMatchRegex = new RegExp(config.include);
(0, file_util_1.readDirectory)(config.target, (file) => {
    if (fileMatchRegex.test(file.fileName)) {
        // valid file
        console.log(file.filePath);
    }
});

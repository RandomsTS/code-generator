#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("./util/file-util");
(0, file_util_1.readDirectory)("./test", (file) => {
    if (/^[a-zA-Z][a-zA-Z0-9]*\.js$/.test(file.fileName) ||
        /\[(.+)\].js/.test(file.fileName) ||
        /\[\.{3}.+\].js/.test(file.fileName)) {
        // valid file
        console.log(file.filePath);
    }
});

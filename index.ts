#! /usr/bin/env node
import { readDirectory } from './util/file-util';

readDirectory ("./test", (file)=>{
    if (
        /^[a-zA-Z][a-zA-Z0-9]*\.js$/.test(file.fileName) ||
        /\[(.+)\].js/.test    (file.fileName) ||
        /\[\.{3}.+\].js/.test (file.fileName)
    )
    {
        // valid file
        console.log (file.filePath);
    }
})






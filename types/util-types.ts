export interface FileMetaData {
    fileName: string,
    filePath: string
}

export interface RandomsConfig {
    target      : string,
    include     : string,
    outputDir   : string,
    outputFile  : string,
    preservedFiles: {
        [key: string]: Array<string> 
    }
}

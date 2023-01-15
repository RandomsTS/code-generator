"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const code_generator_1 = __importDefault(require("./lib/code-generator"));
const codeGenerator = new code_generator_1.default();
exports.default = codeGenerator;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.get('/images/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dirPath = path_1.default.resolve(__dirname + '/..' + req.path);
        const pathObj = path_1.default.parse(req.path);
        const size = req.query.size;
        if (size) {
            const newFilePath = path_1.default.resolve(`${pathObj.dir}/${size}/${pathObj.base}`);
            const newDirPath = path_1.default.resolve(`${pathObj.dir}/${size}`);
            if (!fs_1.default.existsSync(newDirPath))
                fs_1.default.mkdirSync(newDirPath, { recursive: true });
            else if (fs_1.default.existsSync(newFilePath)) {
                res.sendFile(newFilePath);
                return;
            }
            console.time('Image');
            const result = yield (0, sharp_1.default)(dirPath).resize(+size).toFile(newFilePath);
            console.timeEnd('Image');
            res.sendFile(newFilePath);
            return;
        }
        res.sendFile(path_1.default.join(dirPath));
    }
    catch (err) {
        console.error(err);
    }
}));
app.listen(9090, () => console.log('File server is listening: 9090'));

import express from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const app = express();

app.get('/images/*', async (req, res) => {
    try {
        const dirPath = path.resolve(__dirname + req.path);
        const pathObj = path.parse(req.path);
        const size = req.query.size;
        if (size) {
            const newFilePath = path.resolve(`${pathObj.dir}/${size}/${pathObj.base}`);
            const newDirPath = path.resolve(`${pathObj.dir}/${size}`);
            if (!fs.existsSync(newDirPath)) fs.mkdirSync(newDirPath);
            else if (fs.existsSync(newFilePath)) {
                res.sendFile(newFilePath);
                return;
            }
            console.time('Image');
            const result = await sharp(dirPath).resize(+size).toFile(newFilePath);
            console.timeEnd('Image');
            res.sendFile(newFilePath);
            return
        }
        res.sendFile(dirPath);
    } catch(err) {
        console.error(err);
    }
})

app.listen(9090, () => console.log('File server is listening: 9090'));
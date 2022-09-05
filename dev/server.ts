import express from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const app = express();

app.get('/images/*', async (req, res) => {
    try {
        const dirPath = path.resolve(__dirname + '/..' + req.path);
        const pathObj = path.parse(dirPath);
        const size = req.query.size as unknown as number | undefined;
        if (size && fs.existsSync(dirPath)) {
            const newFilePath = path.resolve(`${pathObj.dir}/${size}/${pathObj.base}`);
            const newDirPath = path.resolve(`${pathObj.dir}/${size}`);
            if (!fs.existsSync(newDirPath)) fs.mkdirSync(newDirPath, {recursive: true});
            else if (fs.existsSync(newFilePath)) {
                res.sendFile(newFilePath);
                return;
            }
            const image = sharp(dirPath)
            const meta = await image.metadata();
            let width: null | number = null, height: null | number = null
            if (meta.width && meta.height) {
                if (meta.width < meta.height) {
                    width = +size;
                } else if (meta.width > meta.height) {
                    height = +size;
                } else width = +size
            }

            const result = await sharp(dirPath).resize(width, height).toFile(newFilePath);
            res.sendFile(newFilePath);
            return
        }
        res.sendFile(path.join(dirPath));
    } catch(err) {
        console.error(err);
    }
})

app.listen(9090, () => console.log('File server is listening: 9090'));
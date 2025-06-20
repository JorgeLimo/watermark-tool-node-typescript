import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';

async function addWatermark(inputPath: string, outputFileName: string, watermarkText: string): Promise<Buffer> {
    try {

        const image = await Jimp.read(inputPath);


        const fontBack = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

        const textWidth = Jimp.measureText(font, watermarkText);
        const textHeight = Jimp.measureTextHeight(font, watermarkText, image.bitmap.width);

        const marginX = Math.max(0.22 * image.bitmap.width);
        const marginY = 30;

        const posX = image.bitmap.width - textWidth - marginX;

        image.print(
            fontBack,
            posX + 1,
            image.bitmap.height - textHeight - marginY + 1,
            {
                text: watermarkText,
                alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
                alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
            },
            image.bitmap.width
        );

        image.print(
            font,
            posX,
            image.bitmap.height - textHeight - marginY,
            {
                text: watermarkText,
                alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
                alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
            },
            image.bitmap.width
        );

        const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        const currentDir = __dirname;
        const outputPath = path.join(currentDir, outputFileName);
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`Watermark añadido a ${outputPath}`);
        return imageBuffer;

    } catch (error) {
        console.error('Error al añadir el watermark:', error);
        throw error;
    }
}

const inputImagePath = 'input/image.jpg';
const outputImagePath = "output/" + new Date().getTime() + '.jpg';
const watermarkText = `22, may 2025 8:36:55 am\n123 Av. Miraflores\nUrb. Santa Rosa\nCentro de Lima\nProvincia de Lima`;


addWatermark(inputImagePath, outputImagePath, watermarkText)
    .then(fileObject => {
        console.log('Archivo File creado:', fileObject);
    })
    .catch(error => {
        console.error('Error:', error);
    });
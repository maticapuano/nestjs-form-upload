import sharp from "sharp";

interface ResizeOptions {
  width: number;
  height: number;
  quality: number;
}

export class ImageResizing {
  public static async resize(buffer: Buffer, options: ResizeOptions): Promise<Buffer> {
    const { width, height, quality } = options;

    return await sharp(buffer).resize(width, height).jpeg({ quality }).toBuffer();
  }
}

export interface ResizeOptions {
  /**
   * If prefix is not provided, the default used `width` and `height` will be used.
   * e.g. 200x200-${originalFileName}
   */
  prefix?: string;
  /**
   * Width of the resized image
   */
  width: number;
  /**
   * Height of the resized image
   */
  height: number;
  /**
   * Quality of the resized image (0-100)
   */
  quality?: number;
}

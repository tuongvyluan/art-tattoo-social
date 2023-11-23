import { stringSize } from "./status";

export const filterSize = () => {
  const sizes = new Map();
  sizes.set('-1', 'Tất cả');
  stringSize.map((size, sizeIndex) => {
    sizes.set(`${sizeIndex}`, size)
  })
  return sizes
}

export const filterColor = () => {
  const colors = new Map();
  colors.set(0, 'Tất cả');
  colors.set(1, 'Trắng đen');
  colors.set(2, 'Màu sắc')
  return colors
}
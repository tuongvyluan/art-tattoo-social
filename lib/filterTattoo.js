import { stringSize } from "./status";

export const filterSize = () => {
  const sizes = new Map();
  sizes.set(-1, 'Tất cả');
  stringSize.map((size, sizeIndex) => {
    sizes.set(sizeIndex, size)
  })
  return sizes
}

export const filterColor = () => {
  const colors = new Map();
  colors.set(-1, 'Tất cả');
  colors.set(0, 'Trắng đen');
  colors.set(1, 'Màu sắc')
  return colors
}
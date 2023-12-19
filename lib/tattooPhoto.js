import { randomFrom0To } from './helpers';

export const randomPhoto = [
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213402/tattoo-7_fww1uk.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213402/tattoo-5_amyhqs.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213402/tattoo-8_vrh3pj.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213402/tattoo-6_ipmvzr.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213402/tattoo-1_cjajwn.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213401/tattoo-4_xb4cjw.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213401/tattoo-10_dwkjap.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213401/tattoo-9_hswcik.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213401/tattoo-2_digj71.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700213401/tattoo-3_mznw0h.webp',
	'https://res.cloudinary.com/dl9ctj0ul/image/upload/v1700773791/20200909_MsJK67PwNqomFUj_m8l2ek.jpg'
][randomFrom0To(11)];

export const noImageAvailable =
	'http://res.cloudinary.com/dl9ctj0ul/image/upload/v1702978018/depositphotos_247872612-stock-illustration-no-image-available-icon-vector_rg5eqe.webp';

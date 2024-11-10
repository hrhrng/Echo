// app/fonts.ts 或 lib/fonts.ts
import { Patua_One } from 'next/font/google';

export const patuaOne = Patua_One({
    weight: '400',  // Patua One 只有 400 这个字重
    subsets: ['latin']
});
export function isCharKanji(char: string): boolean {
  return (
    (char >= "\u4e00" && char <= "\u9fcf") ||
    (char >= "\uf900" && char <= "\ufaff") ||
    (char >= "\u3400" && char <= "\u4dbf")
  );
}

export function isCharHiragana(char: string): boolean {
  return char >= "\u3040" && char <= "\u309f";
}

export function isCharKatakana(char: string): boolean {
  return char >= "\u30a0" && char <= "\u30ff";
}

const CHARCODE_ASCII_ZERO = 0x30;
const CHARCODE_ASCII_NINE = 0x39;
const CHARCODE_FULLWIDTH_ZERO = 0xff10;
const CHARCODE_FULLWIDTH_NINE = 0xff19;

export function getNumberFromChar(char: string): number {
  const charCode = char.charCodeAt(0);
  if (charCode >= CHARCODE_ASCII_ZERO && charCode <= CHARCODE_ASCII_NINE) {
    return charCode - CHARCODE_ASCII_ZERO;
  }

  if (
    charCode >= CHARCODE_FULLWIDTH_ZERO &&
    charCode <= CHARCODE_FULLWIDTH_NINE
  ) {
    return charCode - CHARCODE_FULLWIDTH_ZERO;
  }

  return NaN;
}

export function isCharNumericDigit(char: string): boolean {
  return !isNaN(getNumberFromChar(char));
}

const KATAKANA_TO_HIRAGANA_DELTA =
  "\u3041".charCodeAt(0) - "\u30a1".charCodeAt(0);

function convertCharToHiragana(char: string): string {
  if (isCharKatakana(char)) {
    return String.fromCharCode(char.charCodeAt(0) + KATAKANA_TO_HIRAGANA_DELTA);
  }

  return char;
}

export function convertToHiragana(str: string): string {
  if (!str.length) {
    return "";
  }

  if (str.length === 1) {
    return convertCharToHiragana(str);
  }

  return Array.from(str)
    .map(convertCharToHiragana)
    .join("");
}
